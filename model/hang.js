const pg = require('./knex');

/**
 * Adds a new hang
 * @param {string} start iso date time
 * @param {string} end iso date time
 * @param {number} userId user id
 */
async function addHang(start, end, userId) {
  const created = await pg('hang').insert({
    app_user_id: userId,
    start,
    end
  }).returning(['id', 'start', 'end']);

  return created[0];
}

/**
 * Gets all hangs for a given user
 * @param {number} userId user id
 */
async function getAll(userId) {
  return await pg('hang').where({ app_user_id: userId }).select('*');
}

/**
 * Gets all hangs for a given user and date
 * @param {number} userId User id
 * @param {string} date Iso date (e.g. 2017-01-01)
 */
async function getByDate(userId, date) {
  const hangs = await pg('hang').where({ app_user_id: userId }).andWhere('start', 'like', date + '%').select('*');
  return hangs.map(h => ({
    id: h.id,
    start: h.start,
    end: h.end
  }));
}

module.exports = {
  addHang,
  getAll,
  getByDate
}
