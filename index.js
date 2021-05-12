const Koa = require('koa');
const app = new Koa();

const users = require('./routes/users.js');

app.use(users.routes());

let port = process.env.PORT || 3000;

app.listen(port);
console.log(`API server running on port ${port}`);
