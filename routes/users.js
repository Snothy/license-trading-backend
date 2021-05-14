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

//shelters
router.get('/:id([0-9]{1,})/shelters', getUserShelters);                    //admin only   
router.post('/:id([0-9]{1,})/shelters', bodyparser(), assignUserShelter);   //admin only
router.del('/:id([0-9]{1,})/shelters', bodyparser(), removeUserShelter);    //admin only
//roles ADMIN ONLY
router.get('/:id([0-9]{1,})/roles', getUserRoles);                                //list all users and their roles, once a user is selected (:/id), can perform bottom actions on them                                  
router.post('/:id([0-9]{1,})/roles', bodyparser(), assignUserRole); //create new entry in users_roles table (assign role) using user id
router.del('/:id([0-9]{1,})/roles', bodyparser(), removeUserRole);  //remove entry from users_roles table (remove role) using user id

//shelters ADMIN ONLY 
//make sheltyer go assign
//make shelter go remove

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
    if (result.affectedRows) {
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
        result = await model.updateUser(user);
        if (result.affectedRows) {
            ctx.body = {ID : id, updated: true};
        }
    }
}

async function removeUser(ctx) {
    const id = ctx.params.id;
    let result = await model.removeUser(id);
    if (result.affectedRows) {
        ctx.status = 200;
        ctx.body = {ID : id, deleted : true};
    }
}

//FAVOURITES
async function getFavourites(ctx) {
    const {id} = ctx.params;
    const result = await model.getFavourites(id);
    if (result.length) {
        ctx.body = {favourites : result};
    }
}

async function setFavourites(ctx) {
    return null;
}

//SHELTERS | admin only
async function getUserShelters(ctx) {
    const {id} = ctx.params;
    const result = await model.getUserShelters(id);
    if (result.length) {
        ctx.body = {shelters : result};
    }
}

async function assignUserShelter(ctx) {
    const {id:user_id} = ctx.params;
    const {shelter_id} = ctx.request.body;
    const hasShelter = await model.hasShelter(user_id, shelter_id);
    if(hasShelter) {
        ctx.status = 409; //conflict 
        return ctx.body = {assigned : false};
    }
    const result = await model.assignUserShelter(user_id, shelter_id);
    if(result.affectedRows) {
        ctx.status = 201;
        ctx.body = {assigned : true};
    }
}

async function removeUserShelter(ctx) {
    const {id:user_id} = ctx.params;
    const {shelter_id} = ctx.request.body;
    const hasShelter = await model.hasShelter(user_id, shelter_id);
    if(!hasShelter) {
        ctx.status = 409; //conflict 
        return ctx.body = {removed : false};
    }
    const result = await model.removeUserShelter(user_id, shelter_id);
    if(result.affectedRows) {
        ctx.status = 201;
        ctx.body = {removed : true};
    }
}
//ROLES
async function getUserRoles(ctx) {
    const {id} = ctx.params;
    const result = await model.getUserRoles(id);
    if (result.length) {
        ctx.body = {roles : result};
    }
}

async function assignUserRole(ctx) {
    const {id:user_id} = ctx.params;
    const {role_id} = ctx.request.body;
    const hasRole = await model.hasRole(user_id, role_id);
    if(hasRole) {
        ctx.status = 409; //conflict (user already has that role, can't assign it again)
        return ctx.body = {created : false};
    }
    const result = await model.assignUserRole(user_id, role_id);
    if(result.affectedRows) {
        ctx.status = 201;
        ctx.body = {created : true};
    }
}

async function removeUserRole(ctx) {
    const {id:user_id} = ctx.params;
    const {role_id} = ctx.request.body;
    const hasRole = await model.hasRole(user_id, role_id);
    if(!hasRole) {
        ctx.status = 409;
        return ctx.body = {removed : false};
    }
    const result = await model.removeUserRole(user_id, role_id);
    if(result.affectedRows) {
        ctx.status = 200;
        ctx.body = {removed : true};
    }
}

module.exports = router;