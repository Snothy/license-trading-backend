const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/roles');
const auth = require('../controllers/auth');
const perms = require('../permissions/roles');

const { validateCreateRole, validateUpdateRole } = require('../controllers/validation');

//const {permsReadAll} = require('../permissions/roles');

//route only accessible by the admin role | manages staff/users
const router = Router({ prefix: '/api/roles' });

router.get('/', auth, perms.readAll, getAllRoles); //list all roles
router.post('/', auth, perms.create, bodyparser(), validateCreateRole, createRole); //create new roles

router.get('/:id([0-9]{1,})', auth, perms.read, bodyparser(), getById);
router.put('/:id([0-9]{1,})', auth, perms.update, bodyparser(), validateUpdateRole, updateRole); //update role
router.del('/:id([0-9]{1,})', auth, perms.remove, bodyparser(), removeRole); //remove role

async function getAllRoles (ctx) {
    const result = await model.getAllRoles();
    if (result.length) {
        ctx.body = result;
    }
}

async function getById (ctx) {
    const id = ctx.params.id;
    const result = await model.getById(id);
    if (result.length) {
        const role = result[0];
        ctx.body = role;
    }
}

async function createRole (ctx) {
    const role = ctx.request.body;
    //console.log(role);
    const result = await model.createRole(role);
    if (result.affectedRows) {
        const id = result.Id;
        //console.log(result.insertId);
        ctx.status = 201;
        ctx.body = { ID: id, created: true };
    }
}

async function updateRole (ctx) {
    const id = ctx.params.id;
    //check if role exists
    let result = await model.getById(id);
    if (result.length) {
        const role = result[0];
        const { ID, ...body } = ctx.request.body;
        Object.assign(role, body);
        result = await model.updateRole(role);
        if (result.affectedRows) {
            ctx.status = 200;
            return ctx.body = { ID: id, updated: true };
        }
    }
}

async function removeRole (ctx) {
    const id = ctx.params.id;
    const result = await model.removeRole(id);
    if (result.affectedRows) {
        ctx.status = 200;
        ctx.body = { ID: id, deleted: true };
    }
}

module.exports = router;
