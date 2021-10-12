import React from 'react';
import LoginForm from './LoginForm';
import ThirdPartyLoginForm from './ThirdPartyLoginForm';

const Login = (props) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h4>
            Login
            </h4>
            <LoginForm />
            <ThirdPartyLoginForm />
        </div>
    );
};

export default Login;