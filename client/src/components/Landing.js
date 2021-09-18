import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h3>
                make it visible!
            </h3>
            <p style={{ fontSize: '1.5em', width: '600px', margin: '100px auto' }}>Hi, verlieren Sie Daten? Das wollen Sie nicht! Wir auch nicht. 
            Daher haben wir den Tracking-Service <span style={{ fontWeight: 'bold' }}>track anything</span> kreiert.
            Sammeln Sie Daten effektiv. Werten Sie Ihre Daten gezielt aus. Erhalten Sie neue Einblicke in Ihre Prozesse.
            Schnell, einfach, flexibel.</p>
            <Link to="/signup" class="waves-effect waves-light btn white-text blue-grey"><i class="material-icons right">keyboard_arrow_right</i>Jetzt Anmelden</Link>
        </div>
    );
};

export default Landing;