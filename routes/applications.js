const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/applications');
const auth = require('../controllers/auth');
const can = require('../permissions/applications');

const { validateUpdateApplication, validateCreateApplication } = require('../controllers/validation');

const router = Router({ prefix: '/api/applications' });

router.get('/', auth, getAll);
router.post('/', auth, bodyparser(), validateCreateApplication, createApplication);
// !!!!!!! UPDATE DB SCHEMA FOR TELEPHONE_NUMBER !!!!!!!!! STRING NOT INT, INT IS INT

router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyparser(), validateUpdateApplication, updateApplication);
router.del('/:id([0-9]{1,})', auth, bodyparser(), removeApplication);

//STAFF CAN UPDATE AN APPLICATIONS STATUS
//STAFF CAN FILTER AND SEARCH APPLICATIONS

async function getAll (ctx) {
    //perform role check
    const user = ctx.state.user;
    const permission = can.readAll(user);
    //console.log(permission);
    if (!permission.granted) {
        //console.log('b');
        //role - user (get applications by user id)
        const result = await model.getAllUser(user.ID);
        if (result.length) {
            return ctx.body = result;
        }
    } else {
        //role - staff or admin (get all applications)
        const result = await model.getAllStaff();
        if (result.length) {
            return ctx.body = result;
        }
    }
}

async function getById (ctx) {
    const id = ctx.params.id;
    const result = await model.getById(id);

    const permission = can.read(ctx.state.user, result.appData[0]);
    //console.log(permission);
    if (!permission.granted) {
        return ctx.status = 403;
    }
    //console.log('a');
    if (result.appData.length) {
        const application = result.appData[0];
        const images = result.images;
        ctx.body = { application, images };
    }
}

async function createApplication (ctx) {
    const application = ctx.request.body;
    application.user_ID = ctx.state.user.ID;
    const result = await model.createApplication(application);

    if (result.affectedRows) {
        const id = result.Id;
        ctx.status = 201;
        ctx.body = { ID: id, created: true };
    }
}

async function updateApplication (ctx) {
    const id = ctx.params.id;
    //Checking if application exists
    let result = await model.getById(id);
    //console.log(result);
    if (result.appData.length) {
        //permission handling
        const permission = can.update(ctx.state.user, result.appData[0]);
        //console.log(permission);
        //console.log(permission.granted);
        if (!permission.granted) {
            return ctx.status = 403;
        }

        const application = result.appData[0];
        //console.log(ctx.request.body);
        const { ID, dateRegistered, ...body } = ctx.request.body;
        Object.assign(application, body);
        //console.log(application);
        result = await model.updateApplication(application);
        //console.log(result);
        if (result.affectedRows) {
            ctx.status = 200;
            return ctx.body = { ID: id, updated: true };
        } //ERROR HANDLIIIIING
    } //else application doesnt exist HANDLE ERRORS
}

async function removeApplication (ctx) {
    const id = ctx.params.id;

    //perms check
    const application = await model.getById(id);
    const permission = can.delete(ctx.state.user, application.appData[0]);
    if (!permission.granted) {
        return ctx.status = 403;
    }

    const result = await model.removeApplication(id);
    if (result.affectedRows) {
        return ctx.body = { ID: id, deleted: true };
    }
}

module.exports = router;
