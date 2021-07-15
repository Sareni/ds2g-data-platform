mongodb = {
    username: 'shinyUser',
    password: 'Sume2+tw2',
    dbname: 'shinyapps',
    connectionString: '',
}
mongodb.connectionString = `mongodb+srv://${mongodb.username}:${mongodb.password}@shinyapp-czgur.mongodb.net/${mongodb.dbname}?retryWrites=true&w=majority`;

mysql = {
    host: '116.203.73.185',
    username: 'superset',
    password: 't1w2s3co3',
    database: 'tracking',
}

AVAILABELE_DATABASES = {
    MONGODB: 'mongodb',
    MYSQL: 'mysql',
}

module.exports = {
    googleClientID: '174899311990-j9f02rerfifo1rv3vl4s3i682c4v05a1.apps.googleusercontent.com',
    googleClientSecret: 'qykxdTyusxVnUHFQXepJby7C',
    mongodbConnectionString: mongodb.connectionString,
    cookieKey: 'asgjpasdfupjsaf8eurupasurhasdp8',
    stripePublishableKey: 'pk_test_p3xP1tI1A3ek7VJ3L5CRrUL2',
    stripeSecretKey: 'sk_test_dyETPRaySeKyP1vXUAgduNG2',
    sendGridName2: 'secondTry',
    sendGridKey2: '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',
    redirectDomain: 'http://test.zenpa.at',
    accountManagementServerURI: 'http://168.119.245.136:5000',
    shinyHost: 'shiny.zenpa.at',
    shinyPort: '80',
    supersetHost: 'superset.zenpa.at',
    supersetPort: '80',
    cryptoKey: 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
    dbConfigs: {
        mysql,
        mongodb
    },
    supersetConfig: {
        apiURL: 'http://superset.zenpa.at/api/v1',
        username: 'admin',
        password: 'admin'
    },
    AVAILABELE_DATABASES,
    testPw: 'testA_B!C123',
    AUTH0_CLIENT_ID: '5pMxtEdbs0hUHufMBm2QyLcJCBfT86z3',
    AUTH0_DOMAIN: 'dev-x4orscvo.eu.auth0.com',
    AUTH0_CLIENT_SECRET: 'jUi8_Fr2xvHalPV1giEXBiuTJX6GuUqpDLaQxlSel66wNyXxihABFQ3w27FcIHkk',
    client_id: '5pMxtEdbs0hUHufMBm2QyLcJCBfT86z3',
    client_secret: 'jUi8_Fr2xvHalPV1giEXBiuTJX6GuUqpDLaQxlSel66wNyXxihABFQ3w27FcIHkk'
}
