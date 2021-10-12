import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMessageData } from '../actions';
import CustomForm from './CustomForm';

// https://codepen.io/vaskopetrov/pen/amxvrY



// TODO USE Materialize SWITCHES INSTEAD

class MessageForm extends Component {
    constructor(props) {
        super(props);

        this.action = '/api/message';
        this.submitButton = {
            icon: 'done',
            text: 'Senden'
        };
        this.cancelButton = true;
    }

    render() {
        return (
        <div>
            <CustomForm action={this.action} submitButton={this.submitButton} cancelButton={this.cancelButton}>
                <div class="row">
                    <div class="input-field col s12">
                    <input id="id" name="id" type="text" required readonly="readonly" defaultValue={this.props.messageData.messageCount}/>
                    <label class='active' for="id">ID</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                    <input id="releaseDate" name="releaseDate" type="date" class="validate" required min="2020-01-01" max="2030-12-31"/>
                    <label class='active' for="releaseDate">Datum</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                    <textarea id="content" name='content' class="validate materialize-textarea" required />
                    <label for="content">Inhalt</label>
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
