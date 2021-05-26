const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/users');
const auth = require('../controllers/auth');
const issueJwt = require('../strategies/issueJwt');
const can = require('../permissions/users');
const bcrypt = require('bcrypt');

const { validateCreateUser, validateUpdateUser, validateAoRrole } = require('../controllers/validation');

const router = Router({ prefix: '/api/users' });

// ONLY TESTED GETALL, GETBYID, POST
// user routes
router.get('/', auth, getAll);
// router.post('/', bodyparser(), addUser);

router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyparser(), validateUpdateUser, updateUser);
router.del('/:id([0-9]{1,})', auth, bodyparser(), removeUser);

// ???crud for roles??? here or separate route? (do i even make crud for roles?)
// implement error handling for all routes

// roles ADMIN ONLY
router.get('/:id([0-9]{1,})/roles', auth, getUserRoles);// list all users and their roles, once a user is selected (:/id), can perform bottom actions on them
router.post('/:id([0-9]{1,})/roles', auth, bodyparser(), validateAoRrole, assignUserRole); // create new entry in users_roles table (assign role) using user id
router.del('/:id([0-9]{1,})/roles', auth, bodyparser(), validateAoRrole, removeUserRole);// remove entry from users_roles table (remove role) using user id

// login&register
// remove prefix somehow | new router, new file or remove the prefix
router.post('/login', bodyparser(), login);
// router.???('/'logout'), logout);
router.post('/register', bodyparser(), validateCreateUser, createUser);

// shelters ADMIN ONLY
// make sheltyer go assign
// make shelter go remove

async function getAll (ctx) {
    const permission = can.readAll(ctx.state.user);
    if (!permission.granted) {
        ctx.status = 403;
    } else {
        const result = await model.getAll();
        if (result.length) {
            return ctx.body = result;
        }
    }
}

async function getById (ctx) {
    const id = ctx.params.id;
    //console.log(ctx.state.user);
    const result = await model.getById(id);
    //console.log(result[0]);
    if (result.length) {
        const user = result[0];

        const permission = can.read(ctx.state.user, user);
        //console.log(permission);
        //console.log(permission.granted);
        if (!permission.granted) {
            return ctx.status = 403;
        } else {
            return ctx.body = permission.filter(user);
        }
    }
}

/*
//replaced by createUser
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
*/

async function updateUser (ctx) {
    //HANDLE EXCEPTION FOR PASSWORD CHANGE
    //BCRYPT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //check for password change ?(if obj.password)??

    const id = ctx.params.id;
    //Checking if user exists
    let result = await model.getById(id);
    if (result.length) {
        const user = result[0];

        const permission = can.update(ctx.state.user, user);
        if (!permission.granted) {
            return ctx.status = 403;
        } else {
            const { ID, dateRegistered, ...body } = ctx.request.body;
            Object.assign(user, body);
            delete user.role;
            //console.log(user);

            //console.log(ctx.request.body);
            const newPass = typeof ctx.request.body.password !== 'undefined';
            //console.log(newPass);
            if (newPass) {
                //user.password is not defined
                //console.log(user);
                user.password = bcrypt.hashSync(user.password, 10);
                //console.log(user.password);
            }
            //console.log(user);
            result = await model.updateUser(user);
            if (result.affectedRows) {
                ctx.body = { ID: id, updated: true };
            }
        }
    }
}

async function removeUser (ctx) {
    //following GDPR regulations, the user has permission to delete his data (right to be forgotten)
    const id = ctx.params.id;
    //console.log(id);
    const permission = can.delete(ctx.state.user, parseInt(id));
    if (!permission.granted) {
        return ctx.status = 403;
    } else {
        const result = await model.removeUser(id);
        if (result.affectedRows) {
            ctx.status = 200;
            ctx.body = { ID: id, deleted: true };
        }
    }
}

//ROLES
async function getUserRoles (ctx) {
    const { id } = ctx.params;
    //console.log(id);
    //perms check
    //console.log(ctx.state.user.role);
    const permission = can.readAllRoles(ctx.state.user);
    if (!permission.granted) {
        return ctx.status = 403;
    } else {
        const result = await model.getUserRoles(id);
        if (result.length) {
            ctx.body = { roles: result };
        }
    }
}

async function assignUserRole (ctx) {
    //perms check
    const permission = can.assignRole(ctx.state.user);
    if (!permission) {
        return ctx.status = 403;
    } else {
        const { id: user_ID } = ctx.params;
        const { role_ID } = ctx.request.body;
        const hasRole = await model.hasRole(user_ID, role_ID);
        if (hasRole) {
            ctx.status = 409; //conflict (user already has that role, can't assign it again)
            return ctx.body = { created: false };
        }
        const result = await model.assignUserRole(user_ID, role_ID);
        if (result.affectedRows) {
            ctx.status = 201;
            ctx.body = { created: true };
        }
    }
}

async function removeUserRole (ctx) {
    //permissions check
    const permission = can.deleteRole(ctx.state.user);
    if (!permission) {
        return ctx.status = 403;
    }
    const { id: user_ID } = ctx.params;
    const { role_ID } = ctx.request.body;
    const hasRole = await model.hasRole(user_ID, role_ID);
    if (!hasRole) {
        ctx.status = 409;
        return ctx.body = { removed: false };
    }
    const result = await model.removeUserRole(user_ID, role_ID);
    if (result.affectedRows) {
        ctx.status = 200;
        ctx.body = { removed: true };
    }
}

//LOGIN & REGISTER
async function login (ctx) {
    const data = ctx.request.body;
    //console.log(data);
    try {
        //console.log('a');
        const user = await model.findByUsername(data.username);

        if (user.length) {
            //VALID USERNAME
            //console.log('b');
            const isValid = await model.verifyPass(user[0], data.password);

            if (isValid) {
                //VALID PASSWORD, ISSUE TOKEN
                //console.log('c');
                const token = issueJwt.issueJwt(user);
                ctx.status = 200;
                return ctx.body = { login: true, token: token.token, expiresIn: token.expires };
            } else {
                //INVALID PASSWORD | redirect to same page
                ctx.status = 401;
                return ctx.body = { login: false, msg: 'Invalid username or password.' }; //don't let the user know which was incorrect
            }
        } else {
            //INVALID USERNAME / NO DATA WAS INPUT | redirect to same page
            ctx.status = 401;
            return ctx.body = { login: false, msg: 'Invalid username or password' };
        }
    } catch (err) {
        console.error(err);
        //do something?
    }
}

async function createUser (ctx) {
    //console.log('a');
    const data = ctx.request.body;
    //const password = ctx.request.body.password
    //console.log(data);
    const result = await model.createUser(data);
    if (result.affectedRows) {
        const id = result.insertId;
        ctx.status = 201;
        const userData = await model.findByUsername(data.username);
        //userData[0].password = password;
        //console.log(userData);
        const jwt = await issueJwt.issueJwt(userData); //assigning the user a JWT
        //the front end takes the assigned token and stores it somewhere for use for future transactions

        ctx.body = { ID: id, created: true, token: jwt.token, expiresIn: jwt.expires };
    }
}

module.exports = router;
