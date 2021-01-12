// import validate from 'deep-email-validator';
const { validate } = require('deep-email-validator')
const { asyncFilter } = require('./utils')

const stripInvalidEmails = async (emailsArr, debug) => {
    validEmails = await asyncFilter(emailsArr, async(email) => {
        let ret = await validate(email);
        if (!ret.valid && debug) {
            console.log("invalid email ", email)
        }
        return ret.valid;
    })
    invalidEmails = emailsArr.filter(email => !validEmails.includes(email))
    return {
        validEmails: validEmails,
        invalidEmails: invalidEmails
    }
}

module.exports = stripInvalidEmails;
