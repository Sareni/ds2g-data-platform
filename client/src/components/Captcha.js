import react, { Component } from 'react';
import ReCAPTCHA from "react-google-recaptcha"

class Captcha extends Component {
    render() {
        return <ReCAPTCHA sitekey="6LeqqpMcAAAAADYLHsosxdtNDVvSe63D39TZIPgV" className='right' style={{ marginBottom: '30px'}}/>;
    }
}

export default Captcha;