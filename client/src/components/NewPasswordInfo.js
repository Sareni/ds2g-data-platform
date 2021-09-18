import React from 'react';

const NewPasswordInfo = (props) => {
    const success = props.location.search && props.location.search.length && props.location.search.search('success=true') >= 0;
    if (success) {
        return (
            <div style={{ textAlign: 'center' }}>
                <h4>
                Neues Passwort vergeben!
                </h4>
                Sie können sich nun mit Ihrem neuen Passwort anmelden.
            </div>
        );
    } else {
        return (
            <div style={{ textAlign: 'center' }}>
                <h4>
                Passwortänderung fehlgeschlagen!
                </h4>
                Versuchen Sie es bitte erneut oder setzen Sie sich mit dem Support in Verbindung.
            </div>
        );
    } 
};

export default NewPasswordInfo;