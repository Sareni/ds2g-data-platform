const mysql = require('mysql');
const { dbConfigs, AVAILABELE_DATABASES } = require('../config/keys');
const { accountKeyToName } = require('./superset');

let connection;

function initMySQLTrackDBConnections() {
    connection = mysql.createConnection({
        host:     dbConfigs.mysql.host,
        user:     dbConfigs.mysql.username,
        password: dbConfigs.mysql.password,
        database: dbConfigs.mysql.database,
      });
      console.log('MySQL connecting...');

      return new Promise((resolve) => {
        connection.connect((err) => {
            if (err) throw err;
            console.log('MySQL connected!');
            resolve();
        });
      }); 
}

async function initTrackDBConnections() {
    // TODO: Pool promises
    await initMySQLTrackDBConnections();
}

// TODO: can be done via superset api (datasource parameters)
async function addMySQLTrackDBViewForNewUser(accountKey) {
    const name = accountKeyToName(accountKey);
    const query = `CREATE VIEW \`${name}\` AS (SELECT * FROM tracks WHERE account="${accountKey}")`;
    return new Promise((resolve) => {
        connection.query(query, function(error, results, fields) {
            if(error) {
                console.log(error);
                throw error;
            }
            resolve();
        });
    });    
}

async function addTrackDBViewForNewUser(accountKey, databaseType = AVAILABELE_DATABASES.MYSQL) {
    switch(databaseType) {
        case AVAILABELE_DATABASES.MYSQL: await addMySQLTrackDBViewForNewUser(accountKey); break;
        default: throw new Error('addDBViewForNewUser: databaseType unknown!');
    } 
}

module.exports = {
    initTrackDBConnections,
    addTrackDBViewForNewUser
}