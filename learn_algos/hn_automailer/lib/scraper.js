const https = require('https');
const fs = require('fs');
const jsdom = require('jsdom');

// @ts-ignore
$ = require('jquery')(new jsdom.JSDOM().window);

module.exports = class Scraper {
    constructor({ debug = false, fetchFromHN = false, jobsListfs, hnurlid }) {
        this.jobsListfs = jobsListfs;
        this.fetchFromHN = fetchFromHN;
        this.debug = debug;
        this.hnurlid = hnurlid;
        if (this.debug) console.log(jobsListfs, fetchFromHN, debug, hnurlid)
    }

    getAllHNPosts(pageN = 1, oldDat = '', fullDat = '') {
        return new Promise(res => {
            if (!this.fetchFromHN) return res();

            this.getPosts(pageN).then(dat => {
                if (this.debug) console.log('getAllHNPosts getPosts l', dat.length, dat == oldDat || dat.length === oldDat.length, oldDat.length, fullDat.length, pageN);
                if (dat == oldDat || dat.length === oldDat.length) {
                    if (this.debug) console.log('got all posts from hn and trimmed', fullDat.length);
                    this._writeOutputFile(fullDat)
                    return res(fullDat);
                } else if (dat.length === 0) {
                    return console.error("Unexpected error, empty return buffer from scrape")
                }
                fullDat += dat;
                oldDat = dat;
                pageN++;
                return this.getAllHNPosts(pageN, oldDat, fullDat).then(fullDat => res(fullDat));
            });
        })
    }

    getPosts(pageN) {
        let url = `https://news.ycombinator.com/item?id=${this.hnurlid}&p=${pageN}`;
        return new Promise(res => {
            this._extractContent(url).then(dat => {
                if (this.debug) console.log('getPosts dat l', dat.length);
                let buf = '';
                let commtext = this._stripChildComments(dat);
                $.each(commtext, (key, value) => {
                    buf += this._htmlDecodeWithLineBreaks($(value).html());
                });
                return res(buf)
            })
        })
    }

    _writeOutputFile(fullDat) {
        fs.writeFileSync(this.jobsListfs, fullDat);
    }

    _stripChildComments(dat) {
        const isToplevelComment = ele => $(ele).find('img') && $(ele).find('img').get(0).width == 0 && $(ele).find('.commtext').get(0) ? true : false;
        const spruceUpJobBlock = ctext => {
            ctext = $(ctext).find('.commtext').get(0)
            ctext.prepend('\n\n');
            ctext.prepend('ago [-]');
            ctext.append('\n\n');
            return ctext;
        }

        let comments = $(dat).find('.comtr'),
            res = [];

        $.each(comments, (k, v) => {
            if (isToplevelComment(v)) {
                try {
                    let ctext = this._swapHtmlTextWithFullRefLinks(v);
                    ctext = spruceUpJobBlock(ctext);
                    res.push(ctext)
                } catch (e) {
                    if (this.debug) console.log(e);
                }
            }
        })

        return res;
    }

    _htmlDecodeWithLineBreaks(html) {
        let breakToken = '_______break_______',
            lineBreakedHtml = html.replace(/<a>(.*?)<a\/>/gi, '$1').replace(/<br\s?\/?>/gi, breakToken).replace(/<p\.*?>(.*?)<\/p>/gi, breakToken + '$1' + breakToken);
        return $('<div>').html(lineBreakedHtml).text().replace(new RegExp(breakToken, 'g'), '\n');
    }

    _extractContent(url) {
        if (this.debug) console.log(url);
        return new Promise(resolve => {
            let dat = '';
            https.get(url, res => {
                res.on('data', data => dat += data)
                res.on('end', () => {
                    if (this.debug) console.log('incoming data l : ' + dat.length, res.statusCode, res.statusMessage);
                    resolve(dat)
                })
                res.on('error', e => this.debug ? console.error('ERROR:', e) : null)
            }).on('error', e => e => this.debug ? console.error(e) : null)
        })
    }

    _swapHtmlTextWithFullRefLinks(dat) {
        let links = $(dat).find('a');
        if (!links) return;
        $.each(links, (k, v) => {
            let url = $(v).attr('href');
            if (url.match('http')) {
                $(v).text(() => url);
            }
        });
        return dat;
    }
}
