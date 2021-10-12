import React from 'react';
import CustomForm from './CustomForm';

// https://codepen.io/vaskopetrov/pen/amxvrY

const SignupForm = () => {
    const action = '/auth/signup';
    const submitButton = {
        icon: 'done',
        text: 'Registrieren'
    }
    const backButton = {
        to: '/',
        icon: 'cancel',
        text: 'Abbrechen'
    }
    const supportButton = true;

    return (
        <div class="container">
            <CustomForm action={action} submitButton={submitButton} backButton={backButton} supportButton={supportButton} recaptcha={true}>
                <div class="row">
                    <div class="input-field col s12">
                    <input id="email" name="email" type="email" class="validate" required />
                    <label for="email">Email</label>
                    </div>
                </div>
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

export default SignupForm;
