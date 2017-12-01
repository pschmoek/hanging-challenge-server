
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('hang', function(table) {
      table.increments();
      table.string('start');
      table.string('end');
      table.integer('app_user_id').unsigned();
      table.foreign('app_user_id').references('app_user.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('hang')
  ]);
};
