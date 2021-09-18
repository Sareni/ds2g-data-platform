import React from 'react';
import SignupForm from './SignupForm';
import ThirdPartyLoginForm from './ThirdPartyLoginForm';

const Signup = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h4>
                Annmelden
            </h4>
            <SignupForm />
            <ThirdPartyLoginForm />
        </div>
    );
};

export default Signup;