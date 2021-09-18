import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchMessageData } from '../actions';

// https://codepen.io/vaskopetrov/pen/amxvrY



// TODO USE Materialize SWITCHES INSTEAD

class MessageForm extends Component {
    componentDidMount() {

    }

    //  

    render() {
        return (
        <div>
            <div class="row">
            <form class="col s12" id="reg-form" action="/api/message" method="POST">
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
                    <div class="row">
                        <div class="input-field col s12">
                        <button class="btn btn-flat btn-register blue-grey white-text right" type="submit">Senden
                            <i class="material-icons right">done</i>
                        </button>
                        <button class="grey btn btn-flat right white-text" type="reset" style={{ marginRight: '10px' }}>Abbrechen
                            <i class="material-icons right">done</i>
                        </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        );
    }
}  

function mapStateToProps({ messageData }) {
    return { messageData };
}
export default connect(mapStateToProps, { fetchMessageData })(MessageForm);
