const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/users');

//route only accessible by the admin role | manages staff/users
const router = Router({prefix : '/api/roles'});

router.get('/', getAllRoles);                               //list all roles
router.post('/', bodyparser(), createRole);                 //create new roles

router.put('/:id([0-9]{1,})', bodyparser(), updateRole);    //update role
router.del('/:id([0-9]{1,})', bodyparser(), removeRole);    //remove role

router.get('/roles', getUsersRoles);                                //list all users and their roles, once a user is selected (:/id), can perform bottom actions on them                                  
router.post('/roles/:id([0-9]{1,})', bodyparser(), assignUserRole); //create new entry in users_roles table (assign role) using user id
router.del('/roles/:id([0-9]{1,})', bodyparser(), removeUserRole);  //remove entry from users_roles table (remove role) using user id


