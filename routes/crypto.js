const crypto = require('crypto');
const { randomKey } = require('../config/ds2g_data_platform_config').crypto;

const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, randomKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, randomKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

module.exports = {
    encrypt,
    decrypt
};