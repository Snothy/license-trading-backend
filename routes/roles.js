const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/roles');

//route only accessible by the admin role | manages staff/users
const router = Router({prefix : '/api/roles'});

router.get('/', getAllRoles);                               //list all roles
router.post('/', bodyparser(), createRole);                 //create new roles

router.get('/:id([0-9]{1,})', bodyparser(), getById);
router.put('/:id([0-9]{1,})', bodyparser(), updateRole);    //update role
router.del('/:id([0-9]{1,})', bodyparser(), removeRole);    //remove role


async function getAllRoles(ctx) {
    console.log('aaa')
    const result = await model.getAllRoles();
    if (result.length) {
        ctx.body = result;
    }
}

async function getById(ctx) {
    const id = ctx.params.id;
    const result = await model.getById(id);
    if (result.length) {
        const role = result[0];
        ctx.body = role;
    }
}

async function createRole(ctx) {
    const role = ctx.request.body;
    //console.log(role);
    const result = await model.createRole(role);
    if (result.affectedRows) {
        const id = result.Id;
        //console.log(result.insertId);
        ctx.status = 201;
        ctx.body = {ID: id, created : true, link : `${ctx.request.path}/${id}`};
    }
}

async function updateRole(ctx) {
    const id = ctx.params.id;
    //check if role exists
    let result = await model.getById(id);
    if (result.length) {
        let role = result[0];
        const {ID, ...body} = ctx.request.body;
        Object.assign(role,body);
        result = await model.updateRole(role);
        if (result.affectedRows) {
            ctx.body = {ID : id, updated: true};
        }
    }
}

async function removeRole(ctx) {
    const id = ctx.params.id;
    let result = await model.removeRole(id);
    if (result.affectedRows) {
        ctx.status = 200;
        ctx.body = {ID : id, deleted : true};
    }
}

module.exports = router;