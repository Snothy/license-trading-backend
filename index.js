const Koa = require('koa');

const app = new Koa();

//const some route = require route
//app.use(route.routes)

let port = process.env.PORT || 3000;

app.listen(port);
