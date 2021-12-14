import React from 'react';
import { Link } from 'react-router-dom';
import CustomForm from './CustomForm';

// https://codepen.io/vaskopetrov/pen/amxvrY



// TODO USE Materialize SWITCHES INSTEAD

const CsvUploadForm = () => {
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

    // TODO customForm?
    return (
        <div>
            <h5>CSV-Upload</h5>
            <form action="/api/uploadCsv" method="post" enctype="multipart/form-data">
                <div class="file-field input-field" style={{width: '600px', marginTop: '40px'}}>
                    <div class="btn">
                        <span>File</span>
                        <input type="file" name='csv'/>
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path validate" type="text" placeholder="Upload csv file"/>
                    </div>
                </div>
                <button className="btn btn-flat btn-register blue-grey white-text right" type="submit">{'Hochladen'}
                    <i className="material-icons right">{'upload'}</i>
                </button>
            </form>
        </div>
        
    );
};

export default CsvUploadForm;