// import validate from 'deep-email-validator';
const { validate } = require('deep-email-validator')
const { asyncFilter } = require('./utils')

const stripInvalidEmails = async (emailsArr, debug) => {
    emailsArr = await asyncFilter(emailsArr, async(email) => {
        let ret = await validate(email);
        if (!ret.valid && debug) {
            console.log("invalid email ", email)
        }
        return ret.valid;
    });
    return emailsArr;
}

module.exports = stripInvalidEmails;
