import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchFlashMessage } from '../actions';

class FlashMessages extends Component {
    componentDidMount() {
        this.props.fetchFlashMessage();
    }

    render() {
        const messages = this.props.flashMessage;
        if(!messages || !Object.keys(messages).length && !this.props.frontendMessage) return null;
    
        const lastInfoMessage = messages.info ? messages.info[messages.info.length - 1] : null;
        const lastErrorMessage = messages.error ? messages.error[messages.error.length - 1] : null;
        const {frontendMessage} = this.props;
    
        return (
            <div>
                {lastInfoMessage && 
                    <div className='customInfoBox'>{JSON.stringify(lastInfoMessage)}</div>
                }
                {lastErrorMessage &&
                    <div className='customErrorBox'>{JSON.stringify(lastErrorMessage)}</div>
                }     
                {frontendMessage &&
                    <div className='customErrorBox'>{JSON.stringify(frontendMessage)}</div>
                }                
            </div>
        );
    }
}

function mapStateToProps({ flashMessage }) {
    return { flashMessage };
}

export default connect(mapStateToProps, { fetchFlashMessage })(FlashMessages);