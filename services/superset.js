const axios = require('axios');
const { exec } = require('child_process');
const { config } = require('process');
const { uid } = require('../routes/utils');
const { superset: supersetConfig } = require('../config/ds2g_data_platform_config');

const { createChartObject } = require('./supersetChartBuilder');
const { createDashboardObject } = require('./supersetDashboardBuilder');

const mongoose = require('mongoose');

const TRACKINATOR_DATABASE = 2;
const apiURL = `${supersetConfig.protocol}://${supersetConfig.host}:${supersetConfig.port}${supersetConfig.apiPath}`;

const DEMO_CONTENT_TYPES = {
    BASIC: 'basic',
    ADVANCED: 'advanced',
    NONE: 'none'
}

async function adminLoginToSuperset() {
    try {
        const res = await axios.post(`${apiURL}/security/login`, {
            password: supersetConfig.adminPassword,
            provider: "db",
            refresh: true,
            username: supersetConfig.adminUser
        });
        return res.data.access_token;
    } catch(e) {
        console.log('Error - adminLoginToSuperset');
    }
}

async function userLoginToSuperset(username, password) {
    try {
        const res = await axios.post(`${apiURL}/security/login`, {
            password,
            provider: "db",
            refresh: true,
            username,
        });
        return res.data.access_token;
    } catch(e) {
        console.log('Error - userLoginToSuperset');
    }
}

async function createSupersetDataset(tableName, alias, database, authToken) {
    try {
        const createResponse = await axios.post(`${apiURL}/dataset/`, {
            database,
            owners: [1],
            schema: "tracking",
            custom_label: alias,
            table_name: tableName,
            // sql: `SELECT * FROM \`${tableName}\`` // Unknown Field
        }, {
            headers: { Authorization: `Bearer ${authToken}`}
        });

        const updateResponse = await axios.put(`${apiURL}/dataset/${createResponse.data.id}`, {
            sql: `SELECT * FROM \`${tableName}\``
        }, {
            headers: { Authorization: `Bearer ${authToken}`}
        });


        return updateResponse.data.id;
    }  catch(e) {
        console.log('Error - createSupersetDataset');
        console.log(JSON.stringify(e));
        // console.log(e.response.data);
    }
}

// TODO check if admin is owner or overridden
async function updateSupersetDatasetOwners(datasetId, newOwners, authToken) {
    try {
        const res = await axios.put(`${apiURL}/dataset/${datasetId}`, {
            owners: newOwners,
        }, {
            headers: { Authorization: `Bearer ${authToken}`}
        });
        return res.data.id;
    } catch(e) {
        console.log('Error - updateSupersetDatasetOwners');
    }
}

async function createSupersetAccount(key, email, password, type, datasets, authToken) {
    let datasourceIds = [];
    let datasourceNames = [];
    datasets.forEach((d) => {
        console.log('dataset', d);
        datasourceIds.push(d.id);
        datasourceNames.push(d.name);
    });

    try {
        const res = await axios.post(`${apiURL}/security/create_ta_user/`, {
            key,
            username: email, // TODO get model username?
            email,
            password,
            type,
            datasourceIds: datasourceIds.join(','),
            datasourceNames: datasourceNames.join(','),
        }, {
            headers: { Authorization: `Bearer ${authToken}`}
        });
        return res.data.id;
    } catch(e) {
        console.log('Error - createSupersetAccount');
    }
}

async function createTrackinatorDemoCharts(userId, datasetId, dashboardId, authToken) {
    const configs = [{
        name: 'Anzahl der Tracks',
        type: 'big_number', // 
        dashboardIds: [dashboardId],
        groupby: [],
        metrics: 'count',
        dateField: 'track_date',
        userId, // TODO remove duplicated Code
        datasetId,
    }, {
        name: 'Tracks im Zeitverlauf',
        type: 'line',
        dashboardIds: [dashboardId],
        groupby: [
            'type'
        ],
        metrics: ['count'],
        dateField: 'track_date',
        userId, // TODO remove duplicated Code
        datasetId,
    }];
    const chartIds = [];

    for (const config of configs) {
        const chartObject = createChartObject(config);
        try {
            const res = await axios.post(`${apiURL}/chart/`,
                chartObject, {
                    headers: { Authorization: `Bearer ${authToken}`}
                }
            );
            chartIds.push(res.data.id);
        } catch(e) {
            console.log('Error - createTrackinatorDemoCharts');
        }
    }
    return chartIds;
}

async function createTrackinatorDemoDasbhoard(userId, authToken) {
    const config = {
        name: 'Trackinator KPIs',
        owners: [userId]
    };
    const o =  createDashboardObject(config.name, config.owners);
    try {
        const res = await axios.post(
            `${apiURL}/dashboard/`,
            o, {
                headers: { Authorization: `Bearer ${authToken}`}
            }
        );
        return res.data.id;
    } catch(e) {
        console.log('Error - createTrackinatorDemoDasbhoard');
        console.log(o);
        console.log(e.response.data);
    }
}

//params:  "{\n  \"adhoc_filters\": [],\n  \"annotation_layers\": [],\n  \"bottom_margin\": \"auto\",\n  \"color_scheme\": \"supersetColors\",\n  \"comparison_type\": \"values\",\n  \"datasource\": \"100__table\",\n  \"extra_form_data\": {},\n  \"granularity_sqla\": \"Date\",\n  \"groupby\": [\n    \"Key\"\n  ],\n  \"label_colors\": {},\n  \"left_margin\": \"auto\",\n  \"limit\": 100,\n  \"line_interpolation\": \"linear\",\n  \"metrics\": [\n    {\n      \"aggregate\": \"MAX\",\n      \"column\": {\n        \"column_name\": \"High\",\n        \"description\": null,\n        \"expression\": null,\n        \"filterable\": true,\n        \"groupby\": true,\n        \"id\": 873,\n        \"is_dttm\": false,\n        \"python_date_format\": null,\n        \"type\": \"DECIMAL(10, 6)\",\n        \"verbose_name\": null\n      },\n      \"expressionType\": \"SIMPLE\",\n      \"hasCustomLabel\": false,\n      \"isNew\": false,\n      \"label\": \"MAX(High)\",\n      \"optionName\": \"metric_n4wq6puhnse_3idtdjpx5qw\",\n      \"sqlExpression\": null\n    }\n  ],\n  \"order_desc\": true,\n  \"rich_tooltip\": true,\n  \"rolling_type\": \"None\",\n  \"row_limit\": 50000,\n  \"show_brush\": \"auto\",\n  \"time_grain_sqla\": \"P1D\",\n  \"time_range\": \"No filter\",\n  \"time_range_endpoints\": [\n    \"unknown\",\n    \"inclusive\"\n  ],\n  \"url_params\": {},\n  \"viz_type\": \"line\",\n  \"x_axis_format\": \"smart_date\",\n  \"x_ticks_layout\": \"auto\",\n  \"y_axis_bounds\": [\n    null,\n    null\n  ],\n  \"y_axis_format\": \"SMART_NUMBER\"\n}", //"{\"groupby\": [\"Key\"], \"time_range\": \"No filter\", \"metrics\": [{\"aggregate\": \"MAX\", \"column\": { \"column_name\": \"High\"}}]}"
        
async function createDemoDataCharts(userId, datasetId, dashboardId, authToken) {
    const chartIds = [];
    const configs = [{
        name: 'Anzahl der Kursdaten',
        type: 'big_number',
        dashboardIds: [dashboardId],
        groupby: [],
        metrics: 'count',
        dateField: 'Date',
        userId, // TODO remove duplicated Code
        datasetId,
    }, {
        name: 'Kurse im Zeitverlauf',
        type: 'line',
        dashboardIds: [dashboardId],
        groupby: [
            'Key'
        ],
        metrics: [
            {
                aggregate: 'MAX',
                column_name: 'High'
            }
        ],
        dateField: 'Date',
        userId,  // TODO remove duplicated Code
        datasetId,
    }];

    for (const config of configs) {
        const chartObject = createChartObject(config);
        try {
            res = await axios.post(
                `${apiURL}/chart/`,
                chartObject, {
                    headers: { Authorization: `Bearer ${authToken}`}
                }
            );
            chartIds.push(res.data.id);
        } catch(e) {
            console.log('Error - createDemoDataCharts');
        }
        
    }
    return chartIds;
}

async function createDemoDataDasbhoard(userId, authToken) {
    const config = {
        name: 'Kursdaten (Demo Dashboard)',
        owners: [userId]
    };
    const o = createDashboardObject(config.name, config.owners);
    try {
        const res = await axios.post(`${apiURL}/dashboard/`,
            o, {
                headers: { Authorization: `Bearer ${authToken}`}
            }
        );
        return res.data.id;
    } catch(e) {
        console.log('Error - createDemoDataDasbhoard');
        console.log(o);
    }
}

async function createBasicSupersetContent(userId, datasetId, authToken) {
    // Create "Übersicht -So viele Tracks sind bereits mit deinem Account-Key gemeldet worden."-Chart
    // Create "Herzlich Willkommen"-Dashboard

    const trackinatorDashboardId = await createTrackinatorDemoDasbhoard(userId, authToken);
    await createTrackinatorDemoCharts(userId, datasetId, trackinatorDashboardId, authToken);
}

async function createAdvancedSupersetContent(userId, datasetIds, authToken) {
    // Create "Übersicht -So viele Tracks sind bereits mit deinem Account-Key gemeldet worden."-Chart
    // Create "Herzlich Willkommen"-Dashboard

    // Demo DB Anbindung + Charts
    const trackinatorDashboardId = await createTrackinatorDemoDasbhoard(userId, authToken);
    await createTrackinatorDemoCharts(userId, datasetIds[0], trackinatorDashboardId, authToken);

    const demoDataDashboardId = await createDemoDataDasbhoard(userId, authToken);
    await createDemoDataCharts(userId, datasetIds[1], demoDataDashboardId, authToken);
    
}

function createNoSupersetContent() {
    console.log('No Superset content created');
}

async function createDemoContent(userId, datasetIds, authToken, type = DEMO_CONTENT_TYPES.BASIC) {
    switch(type) {
        case DEMO_CONTENT_TYPES.BASIC: await createBasicSupersetContent(userId, datasetIds[0], authToken); break;
        case DEMO_CONTENT_TYPES.ADVANCED: await createAdvancedSupersetContent(userId, datasetIds, authToken); break;
        case DEMO_CONTENT_TYPES.NONE: // TODO good practice?
        default: createNoSupersetContent();
    }
}

async function createDatasetsForMainAccount(keyName, email, adminAuthToken) {
    const trackinatorDatasetName = keyName;
    const demoDatasetName = `${keyName}_demo`;
    const trackinatorDatasetId = await createSupersetDataset(trackinatorDatasetName, 'Tracks', TRACKINATOR_DATABASE, adminAuthToken);
    const demoDatasetId = await createSupersetDataset(demoDatasetName, 'Demo', TRACKINATOR_DATABASE, adminAuthToken);

    const datasets = [{
        id: trackinatorDatasetId,
        name: demoDatasetName
    }, {
        id: demoDatasetId,
        name: demoDatasetName
    }];

    const User = mongoose.model('users');
    const existingUser = await User.findOne({ username: email });
    if(!existingUser.datasets) {
        existingUser.datasets = []
    }
    existingUser.datasets.push(...datasets);
    console.log('existing user', existingUser);

    await existingUser.save();

    return datasets;
}

async function initMainAccountInSuperset(keyName, email, password, supersetAccountType, adminAuthToken) {
    const datasets = await createDatasetsForMainAccount(keyName, email, adminAuthToken);
    const userId = await createSupersetAccount(keyName, email, password, supersetAccountType, datasets, adminAuthToken);

    for(const dataset of datasets) {
        await updateSupersetDatasetOwners(dataset.id, [1, userId], adminAuthToken);
    }

    const userAuthToken = await userLoginToSuperset(email, password);
    await createDemoContent(userId, datasets.map(d => d.id), userAuthToken, demoContentType);
}

async function initSubAccountInSuperset(keyName, email, password, supersetAccountType, mainEmail, adminAuthToken) {
    const User = mongoose.model('users');
    const existingUser = await User.findOne({ username: mainEmail });
    const userId = await createSupersetAccount(keyName, email, password, supersetAccountType, existingUser.datasets, adminAuthToken);
}

async function initUserInSuperset(accountKey, email, accountType='user', mainEmail) { // TODO: remove testPw
    const password = uid(64);
    const keyName = accountKeyToName(accountKey);

    try {
        const adminAuthToken = await adminLoginToSuperset();
        switch(accountType) {
            case 'admin': await initMainAccountInSuperset(keyName, email, password, 'admin', adminAuthToken); break;
            case 'subadmin': await initSubAccountInSuperset(keyName, email, password, 'user', mainEmail, adminAuthToken); break;
            case 'subuser': await initSubAccountInSuperset(keyName, email, password, 'sub', mainEmail, adminAuthToken); break;
            default /* 'user' */: await initMainAccountInSuperset(keyName, email, password, 'user', adminAuthToken); break;
        }
        console.log('Superset User is ready!');
    } catch (e) {
        console.log(e);
    }
}

function accountKeyToName(accountKey) {
    return accountKey.replace(/-/g, '3');
}

module.exports = {
    initUserInSuperset,
    accountKeyToName,
    DEMO_CONTENT_TYPES
}
