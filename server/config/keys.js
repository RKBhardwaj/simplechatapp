//Key.js figure out what set of credential to return

if (process.env.NODE_ENV === 'production') {
    //We are production
    module.exports = require('./prod');
} else {
    //We are in development,need to export only the dev keys
    module.exports = require('./dev');
}
