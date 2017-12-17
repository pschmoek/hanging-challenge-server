
exports.up = function(knex, Promise) {
  return Promise.resolve()
    .then(() => 
      knex.schema.createTable('hang_session', function(table) {
        table.increments();
        table.integer('target_time').unsigned();
        table.integer('rest_time').unsigned();
        table.integer('app_user_id').unsigned();
        table.string('date');
        table.foreign('app_user_id').references('app_user.id');
      })
    )
    .then(() => 
      knex.schema.alterTable('hang', function(table) {
        table.integer('hang_session_id').unsigned();
        table.foreign('hang_session_id').references('hang_session.id');
      })
    )
    .then(async () => {
      const hangs = await knex('hang').orderBy('id', 'asc').select('*');
      const sessions = [];
      let current = null;
      for (const hang of hangs) {
        // first hang
        if (!current) {
          current = {
            session: {
              target_time: 60,
              rest_time: 60,
              app_user_id: hang.app_user_id,
              date: hang.start.split('T')[0]
            },
            hangs: [hang]
          };
          continue;
        }
      
        const lastHang = current.hangs[current.hangs.length - 1];
        const expectedStartBefore = new Date(lastHang.end);
        // 60 rest time + 5 buffer
        expectedStartBefore.setSeconds(expectedStartBefore.getSeconds() + 60 + 5);
        if (expectedStartBefore > new Date(hang.start)) {
          current.hangs.push(hang);
        } else {
          sessions.push(current);
          current = {
            session: {
              target_time: 60,
              rest_time: 60,
              app_user_id: hang.app_user_id,
              date: hang.start.split('T')[0]
            },
            hangs: [hang]
          }
        }
      }
    
      // last current var
      sessions.push(current);
    
      for (const session of sessions) {
        let newSession = (await knex('hang_session')
          .returning('*')
          .insert(session.session))[0];

        for (const newSessionsHang of session.hangs) {
          await knex('hang')
            .where({ id: newSessionsHang.id })
            .update({
              hang_session_id: newSession.id
            });
        }
      }
    })
    .then(() =>
      knex.schema.alterTable('hang', function(table) {
        table.dropForeign('app_user_id');
        table.dropColumn('app_user_id');
      })
    );
};

exports.down = function(knex, Promise) {
  throw new Error('No down migration available.');
};
