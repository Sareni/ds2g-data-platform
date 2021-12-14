import React, { useEffect } from 'react';
import CsvUploadForm from './CsvUploadForm';
import CsvImportForm from './CsvImportForm';
import PreferencesForm from './PreferencesForm';
import MessageForm from './MessageForm';
import ShareForm from './ShareForm';
import M from 'materialize-css';
import { connect } from 'react-redux';

const GeneralSettingsTab = (props) => {
    const id = `tab${props.id}`;
    if(!props.accountType) return;
    if(props.tab) {
            // return the tab-code
        const cssClasses = ['blue-grey-text'];
        if (props.active)
            cssClasses.push('active');
        return (
            <li class="tab col s3"><a class={cssClasses.join(' ')} href={`#${id}`}>Allgemein</a></li>
        )
    } else {
    // return the tab's content code
    return (
            <div id={id} class="col s12">
                <PreferencesForm />
            </div>
        )
    }
}

const MessageTab = (props) => {
    const id = `tab${props.id}`;
    if(!props.accountType || props.accountType !== 'admin') return "";
    if(props.tab) {
            // return the tab-code
        const cssClasses = ['blue-grey-text'];
        if (props.active)
            cssClasses.push('active');
        return (
            <li class="tab col s3"><a class={cssClasses.join(' ')} href={`#${id}`}>Nachrichten</a></li>
        )
    } else {
    // return the tab's content code
    return (
            <div id={id} class="col s12">
                <MessageForm />
            </div>
        )
    }
}

const createContent = (props) => {
    const authProps = props.auth;
    if (!authProps) {
        return;
    }

    const tabRegex =  /\/preferences\/([a-z]+)/;
    const tabRegexResult = window.location.href && window.location.href && window.location.href.match(tabRegex);
    const tabMatch = tabRegexResult && tabRegexResult[1];
    const queryParams = props.location.search && props.location.search.length && props.location.search;

    return (
    <div class="row">
            <div class="col s12">
            <ul class="tabs">
                <GeneralSettingsTab accountType={authProps.accountType} active={tabMatch === 'general'} id='1' tab />
                <MessageTab accountType={authProps.accountType} active={tabMatch === 'message'} id='2' tab />
            </ul>
            </div>
            <GeneralSettingsTab accountType={authProps.accountType} id='1' />
            <MessageTab accountType={authProps.accountType} id='2' />
            </div>
            );
}

const renderContent = (props) => {
    if(!props.accountType || props.accountType !== 'admin') return "";
    return (
        <div class="container" style={{ textAlign: 'center' }}>
            <h4>
                Admin-Cockpit
            </h4>
            { createContent(props) }
        </div>
    );
}

const AdminPanel = (props) => {
    useEffect(() => {
        let elems = document.querySelectorAll('.tabs');
        M.Tabs.init(elems, {duration: 200, onShow: undefined, swipeable: false, responsiveThreshold: Infinity}, 1);
    });

    // <li class="tab col s3 disabled"><a href="#test3">Disabled Tab</a></li>
    return (
        <div>
            {renderContent(props)}
        </div>

    );
};

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(AdminPanel);