const config = require('../config/ds2g_data_platform_config');
const axios = require('axios');
const url = 'https://www.google.com/recaptcha/api/siteverify';

module.exports = async (req, res, next) => {
    if (!req.body || !req.body['g-recaptcha-response']) { 
        return res.status(400).send({ error: 'CAPTCHA not done!' });
    }

    const params = new URLSearchParams();
    params.append('secret', config.recaptcha.private);
    params.append('response', req.body['g-recaptcha-response']);

    const cnf = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
          }
    }

    const response =  await axios.post(url, params, cnf);
    const isHuman = response.data.success;
    const err = response.data['error-codes'];

    if (!isHuman) {
        return res.status(400).send({ error: 'You are not a human!'});
    }

    next();
};

/*

await fetch(url, {
        method: 'post',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
          },
        body: `secret=${config.recaptcha.private}&response=${req.body['g-recaptcha-response']}`
    });

    */