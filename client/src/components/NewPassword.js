import React from 'react';
import NewPasswordForm from './NewPasswordForm';

const NewPassword = (props) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h4>
            Neues Passwort vergeben
            </h4>
            <NewPasswordForm location={props.location}/>
        </div>
    );
};

export default NewPassword;