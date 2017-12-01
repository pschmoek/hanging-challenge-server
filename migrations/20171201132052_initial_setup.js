
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('hanging_user', function(table){
      table.increments();
      table.string('fb_id');
      table.string('first_name');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('hanging_user')
  ]);
};