const axios = require('axios');
const { exec } = require('child_process');
const { supersetConfig, testPw } = require('../config/keys');

const demoDatasetId = '0_100';

const DEMO_CONTENT_TYPES = {
    BASIC: 'basic',
    ADVANCED: 'advanced',
    NONE: 'none'
}

async function adminLoginToSuperset() {
    const res = await axios.post(`${supersetConfig.apiURL}/security/login`, {
        password: supersetConfig.password,
        provider: "db",
        refresh: true,
        username: supersetConfig.username
      });
      return res.data.access_token;
}

async function userLoginToSuperset(username, password) {
    const res = await axios.post(`${supersetConfig.apiURL}/security/login`, {
        password,
        provider: "db",
        refresh: true,
        username,
      });
      return res.data.access_token;
}

async function createSupersetTrackinatorDataset(name, authToken) {
    const res = await axios.post(`${supersetConfig.apiURL}/dataset/`, {
        database: 2,
        owners: [1],
        schema: "",
        table_name: name
      }, {
          headers: { Authorization: `Bearer ${authToken}`}
      });
      return res.data.id;
}

async function createSupersetAccount(name, pw, datasetIds, authToken) {
    const res = await axios.post(`${supersetConfig.apiURL}/security/create_ta_user/`, {
        username: name,
        password: pw,
        datasourceIds: datasetIds.join(','),
      }, {
          headers: { Authorization: `Bearer ${authToken}`}
      });
      return res.data.id;
}

async function createTrackinatorDemoCharts(userId, datasetId, dashboardId, authToken) {
    const configs = [{
        name: 'Anzahl der Tracks',
        type: 'big_number', // 
        params: ''
    }, {
        name: 'Tracks im Zeitverlauf',
        type: 'line',
        params: ''
    }];
    const chartIds = [];

    for (const config of configs) {
        const res = await axios.post(`${supersetConfig.apiURL}/chart/`, {
            cache_timeout: 0,
            datasource_id: datasetId + "",
            //datasource_name: "string",
            datasource_type: "table",
            description: "",
            owners: [
                userId
            ],
            params: config.params,
            slice_name: config.name,
            viz_type: config.type,
            dashboards: [dashboardId],
        }, {
            headers: { Authorization: `Bearer ${authToken}`}
        });
        chartIds.push(res.data.id);
    }
    return chartIds;
}

async function createTrackinatorDemoDasbhoard(userId, authToken) {
    const res = await axios.post(`${supersetConfig.apiURL}/dashboard/`, {
        css: "",
        dashboard_title: "Trackinator KPIs",
        json_metadata: "{\"timed_refresh_immune_slices\": [], \"expanded_slices\": {}, \"refresh_frequency\": 0, \"default_filters\": \"{}\", \"color_scheme\": null}",
        owners: [userId],
        position_json: "{\"DASHBOARD_VERSION_KEY\":\"v2\",\"GRID_ID\":{\"children\":[],\"id\":\"GRID_ID\",\"parents\":[\"ROOT_ID\"],\"type\":\"GRID\"},\"HEADER_ID\":{\"id\":\"HEADER_ID\",\"meta\":{\"text\":\"Trackinator KPIs\"},\"type\":\"HEADER\"},\"ROOT_ID\":{\"children\":[\"GRID_ID\"],\"id\":\"ROOT_ID\",\"type\":\"ROOT\"}}",
        published: true,
        //slug: ""
    }, {
        headers: { Authorization: `Bearer ${authToken}`}
    });
    return res.data.id;
}

async function createDemoDataCharts(userId, datasetId, dashboardId, authToken) {
    const configs = [{
        name: 'Anzahl der Kursdaten',
        type: 'big_number',
        params: '',
        dashboardIds: []
    }, {
        name: 'Kurse im Zeitverlauf',
        type: 'line',
        params:  "{\n  \"adhoc_filters\": [],\n  \"annotation_layers\": [],\n  \"bottom_margin\": \"auto\",\n  \"color_scheme\": \"supersetColors\",\n  \"comparison_type\": \"values\",\n  \"datasource\": \"100__table\",\n  \"extra_form_data\": {},\n  \"granularity_sqla\": \"Date\",\n  \"groupby\": [\n    \"Key\"\n  ],\n  \"label_colors\": {},\n  \"left_margin\": \"auto\",\n  \"limit\": 100,\n  \"line_interpolation\": \"linear\",\n  \"metrics\": [\n    {\n      \"aggregate\": \"MAX\",\n      \"column\": {\n        \"column_name\": \"High\",\n        \"description\": null,\n        \"expression\": null,\n        \"filterable\": true,\n        \"groupby\": true,\n        \"id\": 873,\n        \"is_dttm\": false,\n        \"python_date_format\": null,\n        \"type\": \"DECIMAL(10, 6)\",\n        \"verbose_name\": null\n      },\n      \"expressionType\": \"SIMPLE\",\n      \"hasCustomLabel\": false,\n      \"isNew\": false,\n      \"label\": \"MAX(High)\",\n      \"optionName\": \"metric_n4wq6puhnse_3idtdjpx5qw\",\n      \"sqlExpression\": null\n    }\n  ],\n  \"order_desc\": true,\n  \"rich_tooltip\": true,\n  \"rolling_type\": \"None\",\n  \"row_limit\": 50000,\n  \"show_brush\": \"auto\",\n  \"time_grain_sqla\": \"P1D\",\n  \"time_range\": \"No filter\",\n  \"time_range_endpoints\": [\n    \"unknown\",\n    \"inclusive\"\n  ],\n  \"url_params\": {},\n  \"viz_type\": \"line\",\n  \"x_axis_format\": \"smart_date\",\n  \"x_ticks_layout\": \"auto\",\n  \"y_axis_bounds\": [\n    null,\n    null\n  ],\n  \"y_axis_format\": \"SMART_NUMBER\"\n}", //"{\"groupby\": [\"Key\"], \"time_range\": \"No filter\", \"metrics\": [{\"aggregate\": \"MAX\", \"column\": { \"column_name\": \"High\"}}]}"
        dashboardIds: [dashboardId]
    }];
    const chartIds = [];

    for (const config of configs) {
        const res = await axios.post(`${supersetConfig.apiURL}/chart/`, {
            cache_timeout: 0,
            datasource_id: datasetId + "",
            //datasource_name: "string",
            datasource_type: "table",
            description: "",
            owners: [
                userId
            ],
            params: config.params,
            slice_name: config.name,
            viz_type: config.type,
            dashboards: config.dashboardIds,
        }, {
            headers: { Authorization: `Bearer ${authToken}`}
        });
        chartIds.push(res.data.id);
    }
    return chartIds;
}

async function createDemoDataDasbhoard(userId, authToken) {
    const res = await axios.post(`${supersetConfig.apiURL}/dashboard/`, {
        css: "",
        dashboard_title: "Kursdaten (Demo Dashboard)",
        json_metadata: "{\"timed_refresh_immune_slices\": [], \"expanded_slices\": {}, \"refresh_frequency\": 0, \"default_filters\": \"{}\", \"color_scheme\": null}",
        owners: [userId],
        position_json: "{\"DASHBOARD_VERSION_KEY\":\"v2\",\"GRID_ID\":{\"children\":[],\"id\":\"GRID_ID\",\"parents\":[\"ROOT_ID\"],\"type\":\"GRID\"},\"HEADER_ID\":{\"id\":\"HEADER_ID\",\"meta\":{\"text\":\"Kursdaten (Demo Dashboard)\"},\"type\":\"HEADER\"},\"ROOT_ID\":{\"children\":[\"GRID_ID\"],\"id\":\"ROOT_ID\",\"type\":\"ROOT\"}}",
        published: true,
        //slug: ""
    }, {
        headers: { Authorization: `Bearer ${authToken}`}
    });
    return res.data.id;
}

async function createBasicSupersetContent(userId, datasetId, authToken) {
    // Create "Übersicht -So viele Tracks sind bereits mit deinem Account-Key gemeldet worden."-Chart
    // Create "Herzlich Willkommen"-Dashboard

    const trackinatorDashboardId = await createTrackinatorDemoDasbhoard(userId, authToken);
    await createTrackinatorDemoCharts(userId, datasetId, trackinatorDashboardId, authToken);
}

async function createAdvancedSupersetContent(userId, datasetId, authToken) {
    // Create "Übersicht -So viele Tracks sind bereits mit deinem Account-Key gemeldet worden."-Chart
    // Create "Herzlich Willkommen"-Dashboard

    // Demo DB Anbindung + Charts
    const trackinatorDashboardId = await createTrackinatorDemoDasbhoard(userId, authToken);
    await createTrackinatorDemoCharts(userId, datasetId, trackinatorDashboardId, authToken);

    const demoDataDashboardId = await createDemoDataDasbhoard(userId, authToken);
    await createDemoDataCharts(userId, demoDatasetId, demoDataDashboardId, authToken);
    
}

function createNoSupersetContent() {
    console.log('No Superset content created');
}

async function createDemoContent(userId, datasetId, authToken, type = DEMO_CONTENT_TYPES.BASIC) {
    switch(type) {
        case DEMO_CONTENT_TYPES.BASIC: await createBasicSupersetContent(userId, datasetId, authToken); break;
        case DEMO_CONTENT_TYPES.ADVANCED: await createAdvancedSupersetContent(userId, datasetId, authToken); break;
        case DEMO_CONTENT_TYPES.NONE:
        default: createNoSupersetContent();
    }
}

async function initUserInSuperset(accountKey, pw=testPw, demoContentType) {
    const name = accountKeyToName(accountKey);
    const adminAuthToken = await adminLoginToSuperset();
    const trackinatorDatasetId = await createSupersetTrackinatorDataset(name, adminAuthToken);
    const userId = await createSupersetAccount(name, pw, [trackinatorDatasetId, demoDatasetId], adminAuthToken);

    
    const userAuthToken = await userLoginToSuperset(name, pw);
    await createDemoContent(userId, trackinatorDatasetId, userAuthToken, demoContentType);
    console.log('Superset User is ready!');
}

function accountKeyToName(accountKey) {
    return accountKey.replaceAll('-', '3');
}

module.exports = {
    initUserInSuperset,
    accountKeyToName,
    DEMO_CONTENT_TYPES
}
