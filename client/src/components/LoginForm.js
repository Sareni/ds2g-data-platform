import React, { Component } from 'react';
import CustomForm from './CustomForm';


class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.action = '/auth/login'
        this.submitButton = {
            icon: 'input',
            text: 'Login'
        };
        this.backButton = {
            to: '/resetpassword',
            text: 'Passwort vergessen?',
            icon: 'email'
        };
    }

    
    render() {
        return (
            <div class="container">
                <CustomForm action={this.action} submitButton={this.submitButton} backButton={this.backButton} recaptcha={true}>
                    <div class="row">
                        <div class="input-field col s12">
                        <input id="email" name="email" type="email" class="validate" required />
                        <label for="email">Email</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                        <input id="password" name="password" type="password" class="validate" minlength="6" required />
                        <label for="password">Passwort</label>
                        </div>
                    </div>
                </CustomForm>
            </div>
        );
    }
}

export default LoginForm;

/*

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FlashMessages from './FlashMessages';
import FormPreloader from './FormPreloader';

const FORM_STATE = {
    WAITING: 'waiting',
    LOADING: 'loading'
}

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.timeout = 4000; // ms
        this.defaultFormState = FORM_STATE.WAITING;
        this.state = {
            formState: FORM_STATE.WAITING
        }
    }

    resetAfterTimeout() {
        setTimeout(this.resetState, this.timeout);
    }

    resetState = () => {
        this.setState({ formState: this.defaultFormState });
    }

    handleSubmit= () => {
        this.setState({ formState: FORM_STATE.LOADING });
        this.resetAfterTimeout();
    }

    render() {
        return (
            <div class="container">
                <FlashMessages ></FlashMessages>
                <div class="row">
                    <form class="col s12" id="reg-form" action="/auth/login" method="post" onSubmit={this.handleSubmit}>
                        <fieldset style={{border: 'none'}} readonly={this.state.formState !== FORM_STATE.WAITING}>
                        <div>
                            <div class="row">
                                <div class="input-field col s12">
                                <input id="email" name="email" type="email" class="validate" required />
                                <label for="email">Email</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                <input id="password" name="password" type="password" class="validate" minlength="6" required />
                                <label for="password">Passwort</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                            <Link to="/resetpassword" class="grey btn-flat left white-text" style={{ marginRight: '10px' }}>Passwort vergessen?
                                <i class="material-icons right">email</i>
                            </Link>
                            {this.state.formState === FORM_STATE.LOADING &&
                                <FormPreloader className='right'></FormPreloader>
                            }
                            {this.state.formState === FORM_STATE.WAITING &&
                                <button className="btn btn-flat btn-register blue-grey white-text right" type="submit">Login
                                    <i className="material-icons right">input</i>
                                </button>
                            }
                            </div>
                        </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginForm;

*/