const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/users');

//route only accessible by the admin role | manages staff/users
const router = Router({prefix : '/api/roles'});

router.get('/', getAllRoles);                               //list all roles
router.post('/', bodyparser(), createRole);                 //create new roles

router.get('/:id([0-9]{1,})', bodyparser(), getById);
router.put('/:id([0-9]{1,})', bodyparser(), updateRole);    //update role
router.del('/:id([0-9]{1,})', bodyparser(), removeRole);    //remove role


async function getAllRoles(ctx) {
    return null;
}

async function createRole(ctx) {
    return null;
}

async function getById(ctx) {
    return null;
}

async function updateRole(ctx) {
    return null;
}

async function removeRole(ctx) {
    return null;
}