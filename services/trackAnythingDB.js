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

async function createMySQLTrackinatorView(name, accountKey) {
    const query = `CREATE VIEW \`${name}\` AS (SELECT track_date, application, type FROM tracks WHERE account="${accountKey}")`;
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
    const query = `CREATE VIEW \`${name}\` AS (SELECT * FROM demo_data)`;
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