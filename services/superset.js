const axios = require('axios');
const { exec } = require('child_process');
const { config } = require('process');
const { supersetConfig, testPw } = require('../config/keys');

const { createChartObject } = require('./supersetChartBuilder');
const { createDashboardObject } = require('./supersetDashboardBuilder');

const DEMO_CONTENT_TYPES = {
    BASIC: 'basic',
    ADVANCED: 'advanced',
    NONE: 'none'
}

async function adminLoginToSuperset() {
    try {
        const res = await axios.post(`${supersetConfig.apiURL}/security/login`, {
            password: supersetConfig.password,
            provider: "db",
            refresh: true,
            username: supersetConfig.username
        });
        return res.data.access_token;
    } catch(e) {
        console.log('Error - adminLoginToSuperset');
    }
}

async function userLoginToSuperset(username, password) {
    try {
        const res = await axios.post(`${supersetConfig.apiURL}/security/login`, {
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

async function createSupersetDataset(name, alias, database, authToken) {
    try {
        const createResponse = await axios.post(`${supersetConfig.apiURL}/dataset/`, {
            database,
            owners: [1],
            schema: "",
            custom_label: alias,
            table_name: name,
            // sql: `SELECT * FROM ${name}` // Unknown Field
        }, {
            headers: { Authorization: `Bearer ${authToken}`}
        });

        const updateResponse = await axios.put(`${supersetConfig.apiURL}/dataset/${createResponse.data.id}`, {
            sql: `SELECT * FROM ${name}`
        }, {
            headers: { Authorization: `Bearer ${authToken}`}
        });


        return updateResponse.data.id;
    }  catch(e) {
        console.log('Error - createSupersetDataset');
        console.log(e.response.data);
    }
}

// TODO check if admin is owner or overridden
async function updateSupersetDatasetOwners(datasetId, newOwners, authToken) {
    try {
        const res = await axios.put(`${supersetConfig.apiURL}/dataset/${datasetId}`, {
            owners: newOwners,
        }, {
            headers: { Authorization: `Bearer ${authToken}`}
        });
        return res.data.id;
    } catch(e) {
        console.log('Error - updateSupersetDatasetOwners');
    }
}

async function createSupersetAccount(name, pw, datasets, authToken) {
    let datasourceIds = [];
    let datasourceNames = [];
    datasets.forEach((d) => {
        datasourceIds.push(d.id);
        datasourceNames.push(d.alias);
    });

    try {
        const res = await axios.post(`${supersetConfig.apiURL}/security/create_ta_user/`, {
            username: name,
            password: pw,
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
            const res = await axios.post(`${supersetConfig.apiURL}/chart/`,
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
            `${supersetConfig.apiURL}/dashboard/`,
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
                `${supersetConfig.apiURL}/chart/`,
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
        const res = await axios.post(`${supersetConfig.apiURL}/dashboard/`,
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
        case DEMO_CONTENT_TYPES.NONE:
        default: createNoSupersetContent();
    }
}

async function initUserInSuperset(accountKey, pw=testPw, demoContentType) {
    try {
        console.log('start');
        const name = accountKeyToName(accountKey);
        const adminAuthToken = await adminLoginToSuperset();

        console.log('init', adminAuthToken);

        const TRACKINATOR_DATABASE = 2;
        const trackinatorDatasetId = await createSupersetDataset(name, 'Tracks', TRACKINATOR_DATABASE, adminAuthToken);
        const demoDatasetId = await createSupersetDataset(`${name}_demo`, 'Demo', TRACKINATOR_DATABASE, adminAuthToken);
        //const combinedDemoDatasetId = `0-${demoDatasetId}`; // TODO alias should be used instead
        console.log('datasets');

        const userId = await createSupersetAccount(name, pw, [{id: trackinatorDatasetId, alias: name}, {id: demoDatasetId, alias: `${name}_demo`}], adminAuthToken);
        console.log('account');

        updateSupersetDatasetOwners(trackinatorDatasetId, [1, userId], adminAuthToken);
        updateSupersetDatasetOwners(demoDatasetId, [1, userId], adminAuthToken);
        console.log('update');

        const userAuthToken = await userLoginToSuperset(name, pw);
        await createDemoContent(userId, [trackinatorDatasetId, demoDatasetId], userAuthToken, demoContentType);
        console.log('Superset User is ready!');
    } catch (e) {
        console.log(e);
    }
}

function accountKeyToName(accountKey) {
    return accountKey.replaceAll('-', '3');
}

module.exports = {
    initUserInSuperset,
    accountKeyToName,
    DEMO_CONTENT_TYPES
}
