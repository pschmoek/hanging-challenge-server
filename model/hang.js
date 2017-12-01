const pg = require('./knex');

module.exports = {

  /**
   * Adds a new hang
   * @param {string} date iso date - e.g. 2017-01-05
   * @param {number} seconds hang duration in seconds
   * @param {number} userId user id
   */
  async addHang(date, seconds, userId) {
    const created = await pg('hang').insert({
      hanging_user_id: userId,
      iso_date: date,
      seconds: seconds
    }).returning('id');

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
