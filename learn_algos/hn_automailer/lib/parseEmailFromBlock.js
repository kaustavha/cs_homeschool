const { dedupeArr } = require('./utils');

module.exports = function getEmailParser({ debug, emails, sentEmails }) {
    function parseEmailFromBlock(t, iteration) {
        let emailRx = /[a-z0-9\.\@\-\_\+\{\}\(\)]+/gi;
        let l = t.split('\n'),
            buf = '';
        for (var i = 0; i < l.length; i++) {
            let tl = l[i];
            let words = tl.match(emailRx);
            if (debug) console.log('Words matched using emailRx: ', words);

            if (!words) words = [];
            for (var j = 0; j < words.length; j++) {
                let word = words[j],
                    tb = '';

                if (word.match(/email/gi) ||
                    word.match(/e-mail/gi)) {
                    let start = j < 0 ? 0 : j,
                        end = j + 20 > words.length ? words.length : j + 20;
                    tb += words.slice(start, end).join(" ");

                } else if (word.match(/\[at\]/gi) ||
                    word.match(/\(at\)/gi) ||
                    word.match(/\<at\>/gi) ||
                    word.match(/\_at\_/gi) ||
                    word.match(/\{at\}/gi) ||
                    word.indexOf("@") > -1) {
                    if (debug) console.log('at', word);
                    let start = j - 5 < 0 ? 0 : j - 5,
                        end = j + 5 > words.length ? words.length : j + 5;
                    tb += words.slice(start, end).join(" ");
                } else if (word.match(/\[dot\]/gi) ||
                    word.match(/\(\dot\)/gi) ||
                    word.match(/\s*dot\s*/gi) ||
                    word.match(/\s*\[\.\]\s*/gi) ||
                    word.match(/\<dot\>/gi) ||
                    word.match(/\{dot\}/gi) ||
                    word.match(/\<.\>/gi) ||
                    word.match(/\{.\}/gi) ||
                    word.match(/\s*\(\.\)\s*/gi)) {
                    if (debug) console.log('dot', word);
                    let start = j - 5 < 0 ? 0 : j - 5,
                        end = j + 5 > words.length ? words.length : j + 5;

                    tb += words.slice(start, end).join(" ");
                }

                if (tb.length > 0 && debug) console.log('1', tb);
                tb = parseLine1(tb);
                buf += " " + tb;
            }

        }

        buf = buf.trim();
        let posems = [];
        // further process valid emails
        if (buf.indexOf('@') > -1 && buf.indexOf(".") > -1) {
            let ws = buf.match(emailRx);
            for (var i = 0; i < ws.length; i++) {
                let w = ws[i];
                if (w.indexOf('@') > -1 && w.indexOf(".") > -1) {

                    if (w.length > 0 && debug) console.log('further processing', w);
                    if (w.match(/@/gi).length > 1) {
                        w = w.split("@").splice(1, 2).join("@");

                        if (w.length > 0 && debug) console.log('further processing', w);
                        // w = w.match(/[a-z]+.*\@[a-z]+/gi) + w.match(/\.[a-z]+/gi);
                    }

                    if (w.length > 0 && debug) console.log('further processing', w);
                    w = w.match(/[a-z0-9\.\-\_\+]+\@[a-z0-9\-\.]+\.+[a-z0-9]+/gi) + '';

                    if (w.length > 0 && debug) console.log('further processing', w);
                    // filter out common false matches and people using gmail
                    if (!w.match(/name/) && !w.match(/http/) && !w.match(/www/) && !w.match(/hotmail/)
                        && !w.match(/gmail/)) {
                        posems.push(w);
                    }
                }
            }
        }

        if (posems.length == 0) {
            if (iteration == null || iteration == undefined || iteration < 1) posems = parseEmailFromBlock(parseLine2(t), 1);
        }

        for (let index = 0; index < posems.length; index++) {
            let w = posems[index];
            if (w.match(/.com/)) w.replace(/.com[a-z]+/, '.com ');
            if (w !== 'null' && w) {
                posems[index] = w;
            } else {
                posems.splice(index, 1);
            }
        }

        // do not email peope again************************************
        //IMPORTANT
        // simple check for distinct email then more complex check for company name
        posems = dedupeArr(posems);
        let out = [];
        if (sentEmails.indexOf(posems.join(",")) === -1) out = posems;

        let companyListSentEmails = {};
        sentEmails.forEach(element => {
            companyListSentEmails[element.split('@')[1]] = true;
        });
        if (posems && posems[0] && companyListSentEmails[posems[0].split('@')[1]] ||
            emails.indexOf(posems.join(",")) !== -1) out = ['blacklist'];


        return out;
    }

    function parseLine1(tb) {
        tb = tb.replace(/\s*\[at\]\s*/gi, '@');
        tb = tb.replace(/\s*\[@\]\s*/gi, '@');
        tb = tb.replace(/\s*\(at\)\s*/gi, '@');
        tb = tb.replace(/\s*\<at\>\s*/gi, '@');
        tb = tb.replace(/\s*\{at\}\s*/gi, '@');
        tb = tb.replace(/\s*\(@\)\s*/gi, '@');
        tb = tb.replace(/\s\@\s/gi, '@');

        tb = tb.replace(/\s*\[dot\]\s*/gi, '.');
        tb = tb.replace(/\s*\(dot\)\s*/gi, '.');
        tb = tb.replace(/\s*\(\.\)\s*/gi, '.');
        tb = tb.replace(/\s*\[\.\]\s*/gi, '.');
        tb = tb.replace(/\s*\<dot\>\s*/gi, '.');
        tb = tb.replace(/\s*\{dot\}\s*/gi, '.');
        tb = tb.replace(/\s*\<\.\>\s*/gi, '.');
        tb = tb.replace(/\s*\{\.\}\s*/gi, '.');
        return tb;
    }

    function parseLine2(tb) {
        if (debug) console.log('parseline2 start', tb);

        tb = tb.replace(/\s*\[dot\]\s*/gi, '.');
        tb = tb.replace(/\s*\(\s*dot\s*\)\s*/gi, '.');
        tb = tb.replace(/\s*\(\.\)\s*/gi, '.');
        tb = tb.replace(/\s*\[\.\]\s*/gi, '.');
        tb = tb.replace(/\s*\<dot\>\s*/gi, '.');
        tb = tb.replace(/\s*\{dot\}\s*/gi, '.');
        tb = tb.replace(/\s*\<\.\>\s*/gi, '.');
        tb = tb.replace(/\s*\{\.\}\s*/gi, '.');
        tb = tb.replace(/\s+dot\s+/gi, '.');

        tb = tb.replace(/\s*\[at\]\s*/gi, '@');
        tb = tb.replace(" __4t__ ", '@');
        tb = tb.replace(/\s+at\s+/gi, '@');
        tb = tb.replace(/\s*\[@\]\s*/gi, '@');
        tb = tb.replace(/\s*\(\s*at\s*\)\s*/gi, '@');
        tb = tb.replace(/\s*\<at\>\s*/gi, '@');
        tb = tb.replace(/\s*\{at\}\s*/gi, '@');
        tb = tb.replace(/\s*\(@\)\s*/gi, '@');
        tb = tb.replace(/\s\@\s/gi, '@');

        // thx dalan...
        tb = tb.replace(/\s*chr\(43\)\s*/, '+');
        tb = tb.replace(/\s*chr\(64\)\s*/, '@');
        tb = tb.replace(/\s*chr\(46\)\s*/, '.');

        if (debug) console.log('parseLine2 done', tb, '\n');
        return tb;
    }

    return parseEmailFromBlock;
}
