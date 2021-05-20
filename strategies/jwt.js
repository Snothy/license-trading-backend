var JwtStrategy  = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const users = require('../models/users.js');
const bcrypt = require('bcrypt');

const passport = require('koa-passport');



//GET PATH TO PUBLIC KEY
const fs = require('fs');
const path = require('path');
const keyPath = path.join(__dirname, '..', 'public-key.pem');  //same dir
const keyPub = fs.readFileSync(keyPath, 'utf8');            //spec encoding

var opts = {};
//opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//opts.jwtFromRequest =  ExtractJwt.fromUrlQueryParameter('secret_token')
//opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("Bearer");
/*
opts.jwtFromRequest = function(req) {
    var token = null;
    if (req && req.headers) {
        token = req.headers.authorization;
    }
    return token;
}
*/
opts.secretOrKey = keyPub; // path to the !PUBLIC! id_rsa key for VERIFICATION
opts.algorithms = ["RS256"]

//console.log(opts);

const strategy = new JwtStrategy(opts, async function(jwt_payload, done) {
    //DO PASSWORD VALIDATIONNNNNNNNNNNN ???????????????????????????????????????????????
    //console.log('a');
    //console.log(jwt_payload); //iat and expire date
    //console.log("a");
    //console.log(jwt_payload.sub); //unidentified
    try {
        //console.log(jwt_payload.sub);
        //console.log(jwt_payload.sub.password);
        let userData = await users.findByUsername(jwt_payload.sub);
        //console.log('b');
        //userData = userData[0];
        //console.log(userData);
        //console.log(userData.length);
        if (userData.length) {
            //if the user if correctly verified, return null for error and return the user object
            console.log("User is valid and has correct password");
            return done(null, userData[0]);
        } else {
            //user wasn't verified, could perform some action like refer to sign up
            console.log("No user with this username found");
            return done(null, false);
        }
    } catch (err) {
        //If there's an error, return the error and false for the user object
        return done(err, false);
    }
});



module.exports = strategy;

/*
module.exports = (passport) => {
    passport.use(strategy);
}
*/

/*
            //if the user if correctly verified, return null for error and return the user object
            if(verifyPass(userData, jwt_payload.sub.password)) {
                console.log("User is valid and has correct password");
                return done(null, userData);
            }

*/