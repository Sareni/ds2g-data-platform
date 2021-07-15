const axios = require('axios');
const { accountManagementServer } = require('../config/ds2g_data_platform_config');
const accountManagementServerURI = `${accountManagementServer.host}:${accountManagementServer.port}`;

const getUserDetails = async (userId) => {
    try {
        const { data } = await axios.get(`${accountManagementServerURI}/getAccount/${userId}`);
        return data;
    } catch (e) {
        return {account: '', plan: ''}
    }
    
}


module.exports = {
    getUserDetails
}