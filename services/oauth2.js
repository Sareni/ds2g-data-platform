const mongoose = require('mongoose');

const Token = mongoose.model('tokens');
const Code = mongoose.model('codes');

const { uid } = require('../routes/utils');


  async function createNewCode(clientId, redirectUri, userId) {
    return new Code({
      value: uid(16),
      clientId,
      redirectUri,
      userId
    }).save();
  }

  async function exchangeCodeForToken(codeValue, clientId) {
    const code = await Code.findOne({ value: codeValue })
    code.remove();

    const token = await new Token({
        value: uid(256),
        clientId,
        userId: code.userId // TODO: probably insecure
    }).save();

    // auth0-style
    return {
        'access_token': token.value,
        'refresh_token': '',
        'id_token': '',
        'token_type': 'Bearer',
        'expires_in': 86400
    }
  }

  

          

module.exports = {
  createNewCode,
  exchangeCodeForToken,
}