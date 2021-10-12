import React, { useEffect } from 'react';
import CsvUploadForm from './CsvUploadForm';
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
        return (
            <li class="tab col s3"><a class='active blue-grey-text' href={`#${id}`}>Allgemein</a></li>
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

const DataTab = (props) => {
    const id = `tab${props.id}`;
    if(!props.accountType) return;
    if(props.tab) {
            // return the tab-code
        return (
            <li class="tab col s3"><a class='active blue-grey-text' href={`#${id}`}>Daten</a></li>
        )
    } else {
    // return the tab's content code
    return (
            <div id={id} class="col s12">
                <CsvUploadForm />
            </div>
        )
    }
}

const ShareTab = (props) => {
    const id = `tab${props.id}`;
    if(!props.accountType || (props.accountType !== 'admin' && props.accountType !== 'user')) return "";
    if(props.tab) {
            // return the tab-code
        return (
            <li class="tab col s3"><a class='active blue-grey-text' href={`#${id}`}>Freigabe</a></li>
        )
    } else {
    // return the tab's content code
    return (
            <div id={id} class="col s12">
                <ShareForm />
            </div>
        )
    }
}

const MessageTab = (props) => {
    const id = `tab${props.id}`;
    if(!props.accountType || props.accountType !== 'admin') return "";
    if(props.tab) {
            // return the tab-code
        return (
            <li class="tab col s3"><a class='active blue-grey-text' href={`#${id}`}>Nachrichten</a></li>
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

const createContent = (authProps) => {
    if (!authProps) {
        return;
    }
        return (
        <div class="row">
                <div class="col s12">
                <ul class="tabs">
                    <GeneralSettingsTab accountType={authProps.accountType} id='1' tab />
                    <DataTab accountType={authProps.accountType} id='2' tab />
                    <ShareTab accountType={authProps.accountType} id='3' tab />
                    <MessageTab accountType={authProps.accountType} id='4' tab />
                </ul>
                </div>
                <GeneralSettingsTab accountType={authProps.accountType} id='1' />
                <DataTab accountType={authProps.accountType} id='2' />
                <ShareTab accountType={authProps.accountType} id='3' />
                <MessageTab accountType={authProps.accountType} id='4' />
                </div>
                );
}

const Preferences = (props) => {
    useEffect(() => {
        let elems = document.querySelectorAll('.tabs');
        M.Tabs.init(elems, {duration: 200, onShow: undefined, swipeable: false, responsiveThreshold: Infinity}, 1);
    });


    // <li class="tab col s3 disabled"><a href="#test3">Disabled Tab</a></li>
    return (
        <div class="container" style={{ textAlign: 'center' }}>
            <h4>
                Einstellungen
            </h4>
            { createContent(props.auth) }
        </div>
    );
};

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Preferences);