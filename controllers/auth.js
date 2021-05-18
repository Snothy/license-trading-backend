const passport = require('koa-passport');
const jwt = require('../strategies/jwt');

passport.use(jwt);

module.exports = passport.authenticate('jwt', {session:false});