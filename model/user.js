const pg = require('./knex');

module.exports = {

  /**
   * Gets a user by id
   * @param {number} id User Id
   */
  async getUserById(id) {
    return await pg('hanging_user').where({
      id: id
    }).first('*');
  },

  /**
   * Gets a user by Facebook id
   * @param {number} id Facebook User Id
   */
  async getUser(id) {
    return await pg('hanging_user').where({
      fb_id: id
    }).first('*');
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
