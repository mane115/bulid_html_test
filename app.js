const rd = require('rd'),
    todo = require('./build'),
    config = require('./config');
// clientDir = '/mnt/c/gh_work/intbee-parent/intbee-server/src/main/webapp/WEB-INF/views';

rd.each(config.viewsDir, (f, s, next) => {
    if (!f || f.indexOf('.html') === -1) {
        return next()
    }
    todo(f).then(next)
}, console.log)
