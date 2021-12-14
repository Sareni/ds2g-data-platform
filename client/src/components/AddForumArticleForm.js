import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMessageData } from '../actions';
import CustomForm from './CustomForm';

// https://codepen.io/vaskopetrov/pen/amxvrY



// TODO USE Materialize SWITCHES INSTEAD

class MessageForm extends Component {
    constructor(props) {
        super(props);

        this.action = '/api/forum';
        this.submitButton = {
            icon: 'done',
            text: 'Senden'
        };
        this.backButton = {
            to: '/documentation/forum',
            icon: 'cancel',
            text: 'Abbrechen'
        }
    }

    render() {
        return (
        <div class="container">
            <CustomForm action={this.action} submitButton={this.submitButton} backButton={this.backButton}>
                <input type="hidden" id="rootId" name="rootId" value={ this.props.rootArticleId } />
                <div class="row">
                    <div class="input-field col s12">
                    <input id="headline" name="headline" type="text" required/>
                    <label for="headline">Titel</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                    <textarea id="content" name="content" class="validate materialize-textarea" required/>
                    <label for="content">Text</label>
                    </div>
                </div>
            </CustomForm>
        </div>
        );
    }
}  

function mapStateToProps({ messageData }) {
    return { messageData };
}
export default connect(mapStateToProps, { fetchMessageData })(MessageForm);
