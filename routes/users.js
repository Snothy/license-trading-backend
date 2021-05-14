const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/users');

const router = Router({prefix : '/api/users'});

//ONLY TESTED GETALL, GETBYID, POST
//user routes
router.get('/', getAll);
router.post('/', bodyparser(), addUser);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyparser(), updateUser);
router.del('/:id([0-9]{1,})', bodyparser(), removeUser);

//favourites
router.get('/:id([0-9]{1,})/favourites', getFavourites);
router.post('/:id([0-9]{1,})/favourites', bodyparser(), setFavourites);

//roles ADMIN ONLY
//router.get('/roles', getUsersRoles);                                //list all users and their roles, once a user is selected (:/id), can perform bottom actions on them                                  
router.post('/roles/:id([0-9]{1,})', bodyparser(), assignUserRole); //create new entry in users_roles table (assign role) using user id
router.del('/roles/:id([0-9]{1,})', bodyparser(), removeUserRole);  //remove entry from users_roles table (remove role) using user id

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

async function addUser(ctx) {
    const user = ctx.request.body;
    const result = await model.addUser(user);
    if (result.affectedrows) {
        const id = result.Id;
        //console.log(result.insertId);
        ctx.status = 201;
        ctx.body = {ID: id, created : true, link : `${ctx.request.path}/${id}`};
    }
}

async function updateUser(ctx) {
    const id = ctx.params.id;
    //Checking if user exists
    let result = await model.getById(id);
    if (result.length) {
        let user = result[0];
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

async function getFavourites(ctx) {
    return null;
}

async function setFavourites(ctx) {
    return null;
}

async function assignUserRole(ctx) {
    return null;
}

async function removeUserRole(ctx) {
    return null;
}

module.exports = router;