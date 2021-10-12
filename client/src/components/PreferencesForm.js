import React from 'react';
import { Link } from 'react-router-dom';
import CustomForm from './CustomForm';

// https://codepen.io/vaskopetrov/pen/amxvrY



// TODO USE Materialize SWITCHES INSTEAD

const PreferencesForm = () => {
    const action = '/api/preferences';
    const submitButton = {
        icon: 'done',
        text: 'Speichern'
    };
    const backButton = {
        to: '/',
        icon: 'cancel',
        text: 'Änderungen verwerfen'
    };

    return (
        <div>
            <CustomForm action={action} submitButton={submitButton} backButton={backButton}>
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
            </CustomForm>
        </div>
    );
};

export default PreferencesForm;