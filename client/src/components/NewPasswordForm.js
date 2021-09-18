import React from 'react';
import { Link } from 'react-router-dom';

// https://codepen.io/vaskopetrov/pen/amxvrY

const NewPasswordForm = (props) => {
    return (
        <div class="container">
            <div class="row">
                <form class="col s12" id="reg-form" action="/auth/changepassword" method="post">
                    <input type="hidden" id="token" name="token" value={ props.location.search && props.location.search.length ? props.location.search.substring(7) : ''} />
                    <div class="row">
                        <div class="input-field col s12">
                        <input id="password1" name="password" type="password" class="validate" minlength="6" required />
                        <label for="password1">Passwort</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                        <input id="password2" type="password" class="validate" minlength="6" required />
                        <label for="password2">Passwort wiederholen</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <button class="btn btn-flat btn-register blue-grey white-text right" type="submit">Passwort ändern
                                <i class="material-icons right">send</i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewPasswordForm;
