import React from 'react';
import { Link } from 'react-router-dom';

const ResetPasswordForm = () => {
    return (
        <div class="container">
            <div>
                Geben Sie die e-Mail-Adresse Ihres DS2G Accounts ein, für den Sie das Passwort zurücksetzen möchten. Klicken Sie anschließend auf "Passwort zurücksetzen". Sie erhalten kurz darauf eine e-Mail zum zurücksetzen Ihres Passwortes.
            </div>
            <div class="row">
                <form class="col s12" id="reg-form" action="/auth/resetpassword" method="post">
                    <div class="row">
                        <div class="input-field col s12">
                        <input id="email" name="email" type="email" class="validate" required />
                        <label for="email">Email</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                        <Link to="/login" class="grey btn-flat left white-text" style={{ marginRight: '10px' }}>
                            Back
                            <i className="material-icons left">arrow_back</i>
                        </Link>
                        <button class="btn btn-flat btn-register blue-grey white-text right" type="submit">Passwort zurücksetzen
                            <i class="material-icons right">send</i>
                        </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
