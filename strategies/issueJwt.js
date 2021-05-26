//make use of jsonwebtoken npm library to create the payload function and assign a jwt token to a user
//GET PATH TO PRIVATE KEY
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const keyPath = path.join(__dirname, '..', 'private-key.pem'); //same dir
const keyPrivate = fs.readFileSync(keyPath, 'utf8'); //spec encoding

//const verifyKeyPath = path.join(__dirname, '..', 'public-key.pem');
//const keyPub = fs.readFileSync(verifyKeyPath, 'utf8');

function issueJwt (user) {
    //console.log(user);
    const id = user[0].ID;
    //console.log(username);
    const expiresIn = '2w';

    //payload passed into the verification strategy function
    const payload = {};
    payload.sub = id; //{username: username, password : user[0].password};
    payload.iat = Date.now();
    //console.log('a');
    //console.log(payload);
    //console.log(payload);
    //console.log(username);
    //console.log("q");
    //console.log(payload.sub);
    const signedToken = jwt.sign(payload, keyPrivate, { expiresIn: expiresIn, algorithm: 'RS256' });
    /*
    console.log(signedToken);
    //verify the token for testing  |  VERY USEFUL FOR DEBUGGING......
    jwt.verify(signedToken, keyPub, {algorithms: ['RS256'],  ignoreExpiration: true},  function(err, data){
        console.log(err, data);
   })
   //verify the token
   */
    return {
        token: signedToken,
        expires: expiresIn
    };
}

module.exports.issueJwt = issueJwt;

//console.log(module.exports);

//token: "Bearer " + signedToken,

//expiresIn: expiresIn,
