const mysql = require('mysql');
const { mysql: mysqlConfig, mongodb: mongodbConfig, AVAILABELE_TRACKING_DATABASES } = require('../config/ds2g_data_platform_config').databases;
const { accountKeyToName } = require('./superset');

let connection;

function initMySQLTrackDBConnections() {
    connection = mysql.createConnection({
        host:     mysqlConfig.host,
        user:     mysqlConfig.username,
        password: mysqlConfig.password,
        database: mysqlConfig.database,
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

async function createMySQLTrackinatorView(name, accountKey) {
    const query = `CREATE VIEW \`${name}\` AS (SELECT track_date, application, type, value, cur_date FROM tracks WHERE account="${accountKey}")`;
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

async function createMySQLDemoDataView(name) {
    const query = `CREATE VIEW \`${name}\` AS (SELECT * FROM shares_demo_data)`;
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

// TODO: can be done via superset api (datasource parameters) -> no because to much rights for user?
async function addMySQLTrackDBViewForNewUser(accountKey) {
    const name = accountKeyToName(accountKey);
    await createMySQLTrackinatorView(name, accountKey);
    await createMySQLDemoDataView(`${name}_demo`);
   
}

async function addTrackDBViewForNewUser(accountKey, databaseType = AVAILABELE_TRACKING_DATABASES.MYSQL) {
    switch(databaseType) {
        case AVAILABELE_TRACKING_DATABASES.MYSQL: await addMySQLTrackDBViewForNewUser(accountKey); break;
        default: throw new Error('addDBViewForNewUser: databaseType unknown!');
    } 
}

async function insertCsvData(tableKeys, data) {
    var sql = `INSERT INTO tracks (${tableKeys.join(', ')}) VALUES ?`;
    return new Promise((resolve) => {
        connection.query(sql, [data], function(error, results, fields) {
            if(error) {
                console.log(error);
                throw error;
            }
            resolve();
        });
    });
    //connection.end();
}

module.exports = {
    initTrackDBConnections,
    addTrackDBViewForNewUser,
    insertCsvData
}
