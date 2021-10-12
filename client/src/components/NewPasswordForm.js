import React from 'react';
import CustomForm from './CustomForm';

// https://codepen.io/vaskopetrov/pen/amxvrY

const NewPasswordForm = (props) => {
    const action = '/auth/changepassword';
    const submitButton = {
        icon: 'send',
        text: 'Passwort ändern'
    }

    return (
        <div class="container">
            <CustomForm action={action} submitButton={submitButton} recaptcha={true}>
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
            </CustomForm>
        </div>
    );
};

export default NewPasswordForm;
