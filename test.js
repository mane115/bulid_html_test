const rd = require('rd'),
    fs = require('fs'),
    Promise = require('bluebird'),
    config = require('./config'),
    timeStamp = 1489240190056,
    todo = require('./build'),
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
//todo  删除多余的标记
var test1 = function() {
    rd.each(clientDir, (f, s, next) => {
        if (!f || f.indexOf('.html') === -1) {
            return next()
        }
        return fs.readFileAsync(f).then(data => data = data.toString()).then(html => {
            if (html.indexOf('???') === -1)
                return next();

            html = html.replace(/\?{3}/g, '');
            html = html.replace(/v=[0-9]{13}/g, '')
            return rewriteFile(f, html)
        }).then(next)
    }, console.log);
}
var test2 = function() {
    var dir = `/mnt/c/gh_work/intbee-parent/intbee-server/src/main/webapp/WEB-INF/views/frontend/auth/index.html`;
    fs.readFileAsync(dir).then(data => data = data.toString()).then(html => {
        //  var errorPlace =
        if (html.indexOf('???') === -1)
            return next();
        html = html.replace(/\?{3}/g, '');
        html = html.replace(/v=[0-9]{13}/g, '')
        rewriteFile(dir, html)
        // next()
    })
}
var test3 = function() {
    rd.each(clientDir, (f, s, next) => {
        if (!f || f.indexOf('.html') === -1) {
            return next()
        }
        todo(f).then(next)
    }, console.log)
    // todo('/mnt/c/gh_work/intbee-parent/intbee-server/src/main/webapp/WEB-INF/views/frontend/login.html')
}

module.exports = {
    test1,
    test2,
    test3
}
