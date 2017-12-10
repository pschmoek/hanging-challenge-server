const pg = require('./knex');
const FacebookUserInfo = require('./facebook').FacebookUserInfo;

/**
 * Gets a user by id
 * @param {number} id User Id
 */
async function getUserById(id) {
  return await pg('app_user').where({
    id: id
  }).first('*');
}

/**
 * Gets a user by Facebook id
 * @param {string} facebookId Facebook User Id
 */
async function getUserByFacebookId(facebookId) {
  return await pg('app_user').where({
    fb_id: facebookId
  }).first('*');
}

  /**
 * Creates a new user for a given Facebook user.
 * @param {FacebookUserInfo} facebookUser Facebook user to be saved
 */
async function createUser(facebookUser) {
  const created = await pg('app_user').insert({
    fb_id: facebookUser.facebookId,
    first_name: facebookUser.firstName,
  }).returning('id');

  return created[0];
}

module.exports = {
  getUserById,
  getUserByFacebookId,
  createUser
}
