import React, { useEffect } from 'react';
import PreferencesForm from './PreferencesForm';
import MessageForm from './MessageForm';
import M from 'materialize-css';
import { connect } from 'react-redux';

const DemoDataTab = (props) => {
    const id = `tab${props.id}`;
    if(!props.accountType) return;
    if(props.tab) {
            // return the tab-code
        return (
            <li class="tab col s4"><a class='active blue-grey-text' href={`#${id}`}>Demo Daten</a></li>
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
    if(!props.accountType) return; // !== 'admin'
    if(props.tab) {
            // return the tab-code
        return (
            <li class="tab col s4"><a class='active blue-grey-text' href={`#${id}`}>Nachrichten</a></li>
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
                    <DemoDataTab accountType={authProps.accountType} id='1' tab />
                    <MessageTab accountType={authProps.accountType} id='2' tab />
                </ul>
                </div>
                <DemoDataTab accountType={authProps.accountType} id='1' />
                <MessageTab accountType={authProps.accountType} id='2' />
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