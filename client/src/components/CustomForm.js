import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FlashMessages from './FlashMessages';
import FormPreloader from './FormPreloader';
import Captcha from './Captcha';

const FORM_STATE = {
    WAITING: 'waiting',
    LOADING: 'loading'
}

class CustomForm extends Component {
    constructor(props) {
        super(props);

        this.timeout = 4000; // ms
        this.defaultFormState = FORM_STATE.WAITING;
        this.state = {
            formState: FORM_STATE.WAITING,
            frontendMessage: '',
            captchaToken: ''
        }
    }

    resetAfterTimeout() {
        setTimeout(this.resetState, this.timeout);
    }

    resetState = () => {
        this.setState({ formState: this.defaultFormState, frontendMessage: 'Server-Timeout! Bitte versuchen Sie den Vorgang in ein paar Minuten erneut.' });
    }

    handleSubmit= () => {
        this.setState({ formState: FORM_STATE.LOADING });
        this.resetAfterTimeout();
    }

    setCaptchaToken(token) {
        this.setState({
            captchaToken: token
        });
    }

    render() {
        return (
                <div class="row">
                    <FlashMessages frontendMessage={this.state.frontendMessage}></FlashMessages>
                    <form class="col s12" id="form" action={this.props.action} method="post" onSubmit={this.handleSubmit}>
                        <fieldset style={{border: 'none'}} readonly={this.state.formState !== FORM_STATE.WAITING}>
                        <div>
                            {this.props.children}
                        </div>
                        {this.props.recaptcha &&
                            <Captcha />
                        }
                        <div class="row">
                            <div class="input-field col s12">
                            {this.props.backButton &&
                                <Link to={this.props.backButton.to} class="grey btn-flat left white-text" style={{ marginRight: '10px' }}>{this.props.backButton.text}
                                    <i class="material-icons right">{this.props.backButton.icon}</i>
                                </Link>
                            }
                            {this.props.supportButton &&
                                <Link to="/support" class="grey btn-flat left white-text" style={{ marginRight: '10px' }}>Support kontaktieren
                                    <i class="material-icons right">email</i>
                                </Link>
                            }
                            {this.state.formState === FORM_STATE.LOADING &&
                                <FormPreloader className='right'></FormPreloader>
                            }
                            {this.state.formState === FORM_STATE.WAITING &&
                                <button className="btn btn-flat btn-register blue-grey white-text right" type="submit">{this.props.submitButton.text}
                                    <i className="material-icons right">{this.props.submitButton.icon}</i>
                                </button>
                            }
                            {this.props.cancelButton &&
                                <button class="grey btn btn-flat right white-text" type="reset" style={{ marginRight: '10px' }}>Abbrechen
                                <i class="material-icons right">cancel</i>
                            </button>
                            }
                            </div>
                        </div>
                        </fieldset>
                    </form>
                </div>
        );
    }
}

export default CustomForm;