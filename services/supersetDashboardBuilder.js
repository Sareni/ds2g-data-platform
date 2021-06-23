function createDashboardObject(name, owners) {
    return {
        css: "",
        dashboard_title: name,
        json_metadata: createDashboardMetadata(),
        owners: owners,
        position_json: createDashboardPosition(),
        published: true,
        //slug: ""
    }
}

function createDashboardMetadata() {
    const metadata = {
        timed_refresh_immune_slices: [],
        expanded_slices: {},
        refresh_frequency: 0,
        default_filters: '{}',
        color_scheme: null
    }
    return JSON.stringify(metadata);
}

function createDashboardPosition() {
    const position = {
        DASHBOARD_VERSION_KEY: 'v2',
        GRID_ID: {
            children: [],
            id: 'GRID_ID',
            parents: ['ROOT_ID'],
            type: 'GRID'
        },
        HEADER_ID: {
            id: 'HEADER_ID',
            meta: {
                text: 'Trackinator KPIs'
            },
            type: 'HEADER',
        },
        ROOT_ID: {
            children: ['GRID_ID'],
            id: 'ROOT_ID',
            type: 'ROOT'
        }
    }
    return JSON.stringify(position);
}

module.exports = {
    createDashboardObject
}