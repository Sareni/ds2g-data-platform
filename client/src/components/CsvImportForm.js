import CustomForm from './CustomForm';
import React, { Component } from 'react';
import M from 'materialize-css';

// https://codepen.io/vaskopetrov/pen/amxvrY



// TODO USE Materialize SWITCHES INSTEAD


class CsvImportForm extends Component {
    constructor(props) {
        super(props);

        const headersRegex = /headers=([^&]+)/;
        const headersRegesResult = props.queryParams.match(headersRegex);
        this.headers = headersRegesResult ? headersRegesResult[1].split(',') : [];
    }

    componentDidMount() {
        
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {inDuration: 300, outDuration: 225, coverTrigger: false, constrainWidth: false, alignment: 'left'});
    }

   /* componentDidUpdate() {
        console.log('TEST------------------------')
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {inDuration: 300, outDuration: 225, coverTrigger: false, constrainWidth: false, alignment: 'left'});
    } */

    // TODO customForm?

    /* 
        Applikation --> application
        Datum  --> track_date
        Eventtyp --> type
        Eventparameter --> value
    */

    render() {
        return (
            <div>
                <h5>CSV-Import</h5>
                <form action="/api/importCsv" method="post">
                    {this.headers.map((m, i) => {
                        return (
                            <div class="input-field col s12">
                                <select name={m}>
                                    <option value="application" selected={i === 0}>Applikation</option>
                                    <option value="date" selected={i === 1}>Datum</option>
                                    <option value="type" selected={i === 2}>Typ</option>
                                    <option value="value" selected={i > 2}>Eventparameter</option>
                                </select>
                                <label>{m}</label>
                            </div>
                        );
                    })}
                
                    <button className="btn btn-flat btn-register blue-grey white-text right" type="submit">{'Importieren'}
                        <i className="material-icons right">{'arrow_right'}</i>
                    </button>
                </form>
            </div>
        );
    }
};

export default CsvImportForm;