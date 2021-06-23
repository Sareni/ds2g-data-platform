

function createChartObject(config) {
    const {
        name='unnamed',
        type='big_number',
        datasetId,
        dashboardIds,
        userId,
        groupby,
        metrics,
        dateField
    } = config;

    return {
        cache_timeout: 0,
        datasource_id: String(datasetId),
        //datasource_name: "string",
        datasource_type: "table",
        description: "",
        owners: [
            userId
        ],
        params: createChartParams(type, `${datasetId}__table`, groupby, metrics, dateField),
        slice_name: name,
        viz_type: type,
        dashboards: dashboardIds
    }
}

function configureMetrics(metrics) {
    if(!Array.isArray(metrics)) {
        return undefined;
    }
    return metrics.map((m) => {
        if (typeof m === 'object') {
            return {
                    aggregate: m.aggregate,
                    column: {
                        column_name: m.column_name,
                        description: null,
                        expression: null,
                        filterable: true,
                        groupby: true,
                        //id: 873,
                        is_dttm: false,
                        python_date_format: null,
                        //type: 'DECIMAL(10, 6)',
                        verbose_name: null
                    },
                    expressionType: 'SIMPLE',
                    hasCustomLabel: false,
                    isNew: false,
                    label: `${m.aggregate}(${m.column_name})`,
                    //optionName: 'metric_n4wq6puhnse_3idtdjpx5qw',
                    sqlExpression: null
            };
        } else {
            return m;
        }
    });
}

function createChartParams(type, datasource, groupby, metrics, dateField) {
    const ms = configureMetrics(metrics);
    const m = ms ? undefined : metrics; 
    const paramsObject = {
        adhoc_filters: [],
        annotation_layers: [],
        bottom_margin: 'auto',
        color_scheme: 'supersetColors',
        comparison_type: 'values',
        datasource,
        extra_form_data: {},
        granularity_sqla: dateField,
        groupby,
        label_colors: {},
        left_margin: 'auto',
        limit: 100,
        line_interpolation: 'linear',
        metrics: ms,
        metric: m, 
        order_desc: true,
        rich_tooltip: true,
        rolling_type: 'None',
        row_limit: 1000,
        show_brush: 'auto',
        time_grain_sqla: 'P1D',
        time_range: 'No filter',
        time_range_endpoints: [
            'inclusive',
            'exclusive'
        ],
        url_params: {},
        viz_type: type,
        x_axis_format: 'smart_date',
        x_ticks_layout: 'auto',
        y_axis_bounds: [null, null],
        y_axis_format: 'SMART_NUMBER',
    }

    return JSON.stringify(paramsObject);
}


module.exports = {
    createChartObject,
}