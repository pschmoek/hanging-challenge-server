
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('hang', function(table) {
      table.increments();
      table.integer('seconds').unsigned();
      table.string('date');
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
