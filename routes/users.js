const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/users');

const router = Router({prefix : '/api/users'});

router.get('/', getAll);
router.post('/', bodyparser(), createUser);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyparser(), updateUser);
router.del('/:id([0-9]{1,})', bodyparser(), removeUser);

async function getAll(ctx) {
    const result = await model.getAll();
    if (result.length) {
        ctx.body = result;
    }
}

async function getById(ctx) {
    const id = ctx.params.id;
    const result = await model.getById(id);
    if (result.length) {
        const user = result[0];
        ctx.body = user;
    }
}

async function createUser(ctx) {
    const user = ctx.request.body;
    const result = await model.createUser(user);
    if (result.affectedrows) {
        const id = result.Id;
        console.log(result.insertId);
        ctx.status = 201;
        ctx.body = {ID: id, created : true, link : `${ctx.request.path}/${id}`};
    }
}

async function updateUser(ctx) {
    const id = ctx.params.id;
    //Checking if user exists
    let result = await model.getById(id);
    if (result.length) {
        let user = user[0];
        const {ID, dateRegistered, ...body} = ctx.request.body;
        Object.assign(user,body);
        result = model.updateUser(user);
        if (result.affectedrows) {
            ctx.body = {ID : id, deleted: true};
        }
    }
}

async function removeUser(ctx) {
    const id = ctx.params.id;
    let result = await model.removeUser(id);
    if (result.affectedrows) {
        ctx.body = {ID : id, deleted : true};
    }
}

module.exports = router;