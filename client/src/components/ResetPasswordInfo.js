import React from 'react';

const ResetPasswordInfo = (props) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h4>
            Passwort zurückgesetzt!
            </h4>
            Sie erhalten in Kürze eine e-Mail an Ihre Adresse (<i>{props.location.search && props.location.search.length ? props.location.search.substring(7) : 'keine e-Mail-Adresse angegeben'}</i>) mit der Sie ein neues Passwort festzulegen können.
        </div>
    );
};

export default ResetPasswordInfo;