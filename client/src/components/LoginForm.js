import React from 'react';
import { Link } from 'react-router-dom';

// https://codepen.io/vaskopetrov/pen/amxvrY

const LoginForm = () => {
    return (
        <div class="container">
            <div class="row">
                <form class="col s12" id="reg-form" action="/auth/login" method="post">
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
                    <div class="row">
                        <div class="input-field col s12">
                        <Link to="/resetpassword" class="grey btn-flat left white-text" style={{ marginRight: '10px' }}>Passwort vergessen?
                            <i class="material-icons right">email</i>
                        </Link>
                        <button class="btn btn-flat btn-register blue-grey white-text right" type="submit">Login
                            <i class="material-icons right">input</i>
                        </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
