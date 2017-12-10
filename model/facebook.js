const FB = require('fb');

class FacebookUserInfo {
    /**
     * @param {string} facebookId Facebook internal id
     * @param {string} firstName First name from Facebook
     */
    constructor(facebookId, firstName) {
      this.facebookId = facebookId;
      this.firstName = firstName;
    }
}

/**
 * Looks Facebook user info up.
 * @param {string} token Facebook token to look user info up.
 * @returns {Promise<FacebookUserInfo>} Facebook user info wrapped in Promise.
 */
async function getUserInfo(token) {
  return new Promise((resolve, reject) => {
    FB.api('/me', { fields: 'id,first_name', access_token: token }, response => {
      if (!response.id) {
        return reject('Facebook token is invalid.');
      } else {
        return resolve(new FacebookUserInfo(response.id, response.first_name));
      }
    });
  });
}

module.exports = {
  getUserInfo,
  FacebookUserInfo
}
