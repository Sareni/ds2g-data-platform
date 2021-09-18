import React from 'react';
import { Link } from 'react-router-dom';

const SupportForm = () => {
    return (
        <div class="container" style={{ textAlign: 'center' }}>
            <h4>
                Unterstützung
            </h4>
            <div class="row">
                <form class="col s12" id="reg-form">
                    <div class="row">
                        <div class="input-field col s12">
                        <input id="email" type="email" class="validate" required />
                        <label for="email">Email</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                        <input id="name" type="text" class="validate" required />
                        <label for="name">Name</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                        <textarea  id="message" class="validate materialize-textarea" required />
                        <label for="message">Nachricht</label>
                        </div>
                    </div>
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
                </form>
            </div>
        </div>
    );
};

export default SupportForm;
