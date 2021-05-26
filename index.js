const Koa = require('koa');
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

app.use(users.routes());
app.use(applications.routes());
app.use(roles.routes());
app.use(chats.routes());

const port = process.env.PORT || 3000;

app.listen(port);
console.log(`API server running on port ${port}`);
console.log('https://opera-ski-3000.codio-box.uk/api/');
