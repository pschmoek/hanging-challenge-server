const pg = require('./knex');

module.exports = {

  /**
   * Adds a new hang
   * @param {string} start iso date time
   * @param {string} end iso date time
   * @param {number} userId user id
   */
  async addHang(start, end, userId) {
    const created = await pg('hang').insert({
      app_user_id: userId,
      start,
      end
    }).returning(['id', 'start', 'end']);

    return created[0];
  },

  /**
   * Gets all hangs for a given user
   * @param {number} userId user id
   */
  async getAll(userId) {
    return await pg('hang').where({ app_user_id: userId }).select('*');
  }

}
