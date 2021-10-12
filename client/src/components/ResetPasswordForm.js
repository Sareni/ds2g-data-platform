import React from 'react';
import CustomForm from './CustomForm';

const ResetPasswordForm = () => {
    const action = '/auth/resetpassword';
    const submitButton = {
        icon: 'send',
        text: 'Passwort zurücksetzen'
    };
    const backButton = {
        to: '/login',
        icon: 'arrow_back',
        text: 'Back',
    }

    return (
        <div class="container">
            <div>
                Geben Sie die e-Mail-Adresse Ihres DS2G Accounts ein, für den Sie das Passwort zurücksetzen möchten. Klicken Sie anschließend auf "Passwort zurücksetzen". Sie erhalten kurz darauf eine e-Mail zum zurücksetzen Ihres Passwortes.
            </div>
            <CustomForm action={action} submitButton={submitButton} backButton={backButton} recaptcha={true}>
                <div class="row">
                    <div class="input-field col s12">
                    <input id="email" name="email" type="email" class="validate" required />
                    <label for="email">Email</label>
                    </div>
                </div>
            </CustomForm>
        </div>
    );
};

export default ResetPasswordForm;
