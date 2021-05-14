const Koa = require('koa');
const app = new Koa();

const users = require('./routes/users.js');
const shelters = require('./routes/shelters.js')
const dogs = require('./routes/dogs.js');
const roles = require('./routes/roles.js');

app.use(users.routes());
app.use(shelters.routes());
app.use(dogs.routes());
app.use(roles.routes());

let port = process.env.PORT || 3000;

app.listen(port);
console.log(`API server running on port ${port}`);
