import React from 'react';

const SupportInfo = (props) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h4>
            Supportanfrage erfolgreich gesendet!
            </h4>
            Ihre Anfrage wird ehest möglich beantwortet. Sie erhalten einen Nachricht an die von Ihnen angegebene e-Mail-Adresse (<i>{props.location.search && props.location.search.length ? props.location.search.substring(7) : 'keine e-Mail-Adresse angegeben'}</i>).
        </div>
    );
};

export default SupportInfo;