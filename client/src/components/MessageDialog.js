import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import axios from 'axios';

class MessageDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeMessageId: null,
        };
    }

    async setActiveMessageAsRead() {
        try {
            const res = await axios.post('/api/messageRead', { id: this.state.activeMessageId });
        } catch(e) {
            console.log(e);
        }
    }

    async hideMessageDialog(e) {
        if(e) e.stopPropagation();

        await this.setActiveMessageAsRead();
        this.props.hideMessageDialog();
        
    }

    async openNextMessage(e) {
        const indexActiveMessage = this.props.messageData.unreadMessages.findIndex(msg => msg.id === this.state.activeMessageId);
        const indexNextMessage = indexActiveMessage + 1;

        if(e) e.stopPropagation();

        if (indexNextMessage >= this.props.messageData.unreadMessages.length) {
            await this.hideMessageDialog();
        } else {
            this.setState({ activeMessageId: this.props.messageData.unreadMessages[indexNextMessage].id});
        }

    }

    componentDidMount() {
        if (!this.state.activeMessageId && this.props.messageData.unreadMessages && this.props.messageData.unreadMessages.length) {
            this.setState({
                activeMessageId: this.props.messageData.unreadMessages[0].id
            });
        }
    }

    componentDidUpdate() {
        if (!this.state.activeMessageId && this.props.messageData.unreadMessages && this.props.messageData.unreadMessages.length) {
            this.setState({
                activeMessageId: this.props.messageData.unreadMessages[0].id
            });
        }
    }

    renderContent() {
        if (!this.props.messageDialog.visible
            || !this.props.messageData.unreadMessages
            || !this.props.messageData.unreadMessages.length
            || !this.state.activeMessageId) return;

        const activeMessage = this.props.messageData.unreadMessages.find(msg => msg.id === this.state.activeMessageId);
        return (
            <div onClick={(e) => this.hideMessageDialog(e)} style={{ backgroundColor: 'rgba(0,0,0,0.7)', width: '100%', height: 'calc(100% + 51px)', position: 'absolute', top: '-51px', zIndex: '2' }}>
                <div style={{ backgroundColor: '#FFF', width: '500px', height: '400px', position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                    <div style={{ padding: '10px', height: '50px'}}>
                        Neuigkeit vom { activeMessage.releaseDate }
                    </div>
                    <div style={{ padding: '10px', overflowY: 'auto', height: '290px' }}>
                        { activeMessage.content }
                    </div>
                    <div style={{ padding: '10px', height: '50px'}}>
                        <button onClick={(e) => this.openNextMessage(e)} class="btn btn-flat btn-register blue-grey white-text right" >Weiter
                            <i class="material-icons right">navigate_next</i>
                        </button>
                        <button onClick={(e) => this.hideMessageDialog(e)} class="grey btn-flat right white-text" style={{ marginRight: '10px' }} >Schließen
                            <i class="material-icons right">close</i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        );
    }
}

function mapStateToProps({ messageData, messageDialog }) {
    return { messageData, messageDialog };
}

export default connect(mapStateToProps, actions)(MessageDialog);