const pg = require('./knex');

module.exports = {

  /**
   * Gets a user
   * @param {number} id Facebook User Id
   */
  async getUserId(id) {
    const user = await pg('hanging_user').where({
      fb_id: id
    }).first('id');

    return user ? user.id : null;
  },

  /**
   * Adds a new user
   * @param {Object} user User to be saved
   */
  async addUser(user) {
    const created = await pg('hanging_user').insert({
      fb_id: user.fbId,
      first_name: user.firstName,
    }).returning('id');

    return created[0];
  }

}
