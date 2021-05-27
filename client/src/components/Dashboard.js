import React from 'react';
import { Link } from 'react-router-dom';
import SurveyList from './surveys/SurveyList';

// fixed-action-btn
const Dashboard = () => {
    return (
        <div style={{ backgroundColor: '#F7F7F7'}}>
            <iframe src={`http://superset.zenpa.at:80/login/ownauth`} style={{ width: '100%', height: 'calc(100vh - 69px)' }} frameBorder="0" />
        </div>
    );
}

export default Dashboard;
// height: '26px', padding: '1px', border: 'none', float: 'right', backgroundColor: 'lightgrey'