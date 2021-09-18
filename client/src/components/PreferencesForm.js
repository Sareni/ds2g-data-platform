import React from 'react';
import { Link } from 'react-router-dom';

// https://codepen.io/vaskopetrov/pen/amxvrY



// TODO USE Materialize SWITCHES INSTEAD

const SignupForm = () => {
    return (
        <div>
            <div class="row">
                <form class="col s12" id="reg-form" action="/api/preferences" method="POST">
                    <div class="row">
                        <div class="input-field col s12">
                            <label>
                                <input id='cbTrackinatorData' name='cbTrackinatorData' type="checkbox" />
                                <span>Trackinator-Daten anzeigen</span>
                            </label>
                        </div>
                        <div class="input-field col s12">
                            <label>
                                <input id='cbDemoData' name='cbDemoData' type="checkbox" /> 
                                <span>Demo-Daten anzeigen</span>
                            </label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                        <button class="btn btn-flat btn-register blue-grey white-text right" type="submit" name="action">Speichern
                            <i class="material-icons right">done</i>
                        </button>
                        <Link to="/" class="grey btn-flat right white-text" style={{ marginRight: '10px' }}>&Auml;nderungen verwerfen
                            <i class="material-icons right">cancel</i>
                        </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;
