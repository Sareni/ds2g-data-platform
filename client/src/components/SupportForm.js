import React from 'react';
import { Link } from 'react-router-dom';
import CustomForm from './CustomForm';

const SupportForm = () => {
    const action = '/api/support';
    const submitButton = {
        icon: 'send',
        text: 'Support kontaktieren'
    }
    const backButton = {
        to: '/',
        icon: 'cancel',
        text: 'Abbrechen'
    }

    return (
        <div class="container" style={{ textAlign: 'center' }}>
            <h4>
                Unterstützung
            </h4>
            <CustomForm action={action} submitButton={submitButton} backButton={backButton} recaptcha={true}>
                <div class="row">
                    <div class="input-field col s12">
                    <input id="email" name='email' type="email" class="validate" required />
                    <label for="email">Email</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                    <input id="name" name='name' type="text" class="validate" required />
                    <label for="name">Name</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                    <textarea  id="message" name='message' class="validate materialize-textarea" required />
                    <label for="message">Nachricht</label>
                    </div>
                </div>
            </CustomForm>
        </div>
    );
};

export default SupportForm;

/*
 <div class="row">
                        <div class="input-field col s12">
                        <button class="btn btn-flat btn-register blue-grey white-text right" type="submit" name="action">Support kontaktieren
                            <i class="material-icons right">send</i>
                        </button>
                        <Link to="/" class="grey btn-flat right white-text" style={{ marginRight: '10px' }}>Abbrechen
                            <i class="material-icons right">cancel</i>
                        </Link>
                        </div>
                    </div>

                    */