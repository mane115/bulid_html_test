const rd = require('rd'),
    fs = require('fs'),
    Promise = require('bluebird'),
    config = require('./config'),
    timeStamp = 1489240190056,
    clientDir = '/mnt/c/gh_work/intbee-parent/intbee-server/src/main/webapp/WEB-INF/views';
Promise.promisifyAll(fs);

const rewriteFile = function(dir, data) {
    let option = {
        flag: 'w'
    };
    return fs.writeFileAsync(dir, data, option).then(err => {
        if (err)
            return fail(err);
        console.log(`rewrite file ${dir} success`);
        return data
    });
};
const updateTimeStamp = function(html) {
    let tags = html.match(/<script [^>]*>/g);
    let link = html.match(/<link [^>]*>/g);
    if (tags && tags.length > 0) {
        tags.forEach(tag => {
            var tempTag = tag;
            if (tag.indexOf(config.dir.controller) === -1 && tag.indexOf(config.dir.util) === -1) {
                return;
            }
            if (tag.indexOf('t=') !== -1) {
                tag = tag.replace(/t=[0-9]{13}/g, '');
            }
            if (tag.indexOf('js?"') !== -1 || tag.indexOf("js?'") !== -1) {
                tag = tag.replace('js?', 'js')
            }
            let replace = tag.replace('.js', `.js?t=${timeStamp}`);
            html = html.replace(tempTag, replace);
        });
    }
    if (link && link.length > 0) {
        link.forEach(tag => {
            var tempTag = tag;
            if (tag.indexOf(config.dir.css) === -1) {
                return;
            }
            if (tag.indexOf('t=') !== -1) {
                tag = tag.replace(/t=[0-9]{13}/g, '');
            }
            if (tag.indexOf('css?"') !== -1 || tag.indexOf("css?'") !== -1) {
                tag = tag.replace('css?', 'css')
            }
            let replace = tag.replace('.css', `.css?t=${timeStamp}`);
            html = html.replace(tempTag, replace);
        });
    }
    // console.log(html)
    return html;
}
var todo = function(dir) {
    return fs.readFileAsync(dir).then(data => data = data.toString()).then(updateTimeStamp).then(html => rewriteFile(dir, html))
}

module.exports = todo
