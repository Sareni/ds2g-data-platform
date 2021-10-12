const axios = require('axios');
const { accountManagementServer } = require('../config/ds2g_data_platform_config');
const accountManagementServerURI = `${accountManagementServer.protocol}://${accountManagementServer.host}:${accountManagementServer.port}`;

const getUserDetails = async (userId) => {
    try {
        // TODO exception for sub accounts
        const response = await axios.get(`${accountManagementServerURI}/getAccount/${userId}`);

        return response.data;
    } catch (e) {
        console.log('error - getUserDetails', e);
        return {account: '', plan: ''}
    }
    
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function uid (len) {
    var buf = []
      , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      , charlen = chars.length;  for (var i = 0; i < len; ++i) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }  return buf.join('');
  };


module.exports = {
    getUserDetails,
    uid
}