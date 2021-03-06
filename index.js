const Koa = require('koa');
const cors = require('@koa/cors');
const app = new Koa();
const passport = require('koa-passport');

//???
app.use(passport.initialize());
app.use(passport.session());
//???

const users = require('./routes/users.js');
const applications = require('./routes/applications.js');
const roles = require('./routes/roles.js');
const chats = require('./routes/chats.js');
const uploads = require('./routes/uploads.js');

const options = {
    origin: '*'
};

app.use(cors(options));

app.use(users.routes());
app.use(applications.routes());
app.use(roles.routes());
app.use(chats.routes());
app.use(uploads.routes());

const port = process.env.PORT || 3000;

module.exports = app.listen(port);

//module.exports = app;

//console.log(`API server running on port ${port}`);
//console.log('https://opera-ski-3000.codio-box.uk/api/');
