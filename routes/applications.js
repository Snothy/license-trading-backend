const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/applications');
const auth = require('../controllers/auth');

const router = Router({prefix : '/api/applications'});


router.get('/', auth, getAll);
router.post('/', auth, bodyparser(), createApplication);

router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyparser(), updateApplication);
router.del('/:id([0-9]{1,})', auth, bodyparser(), removeApplication);

//STAFF CAN UPDATE AN APPLICATIONS STATUS
//STAFF CAN FILTER AND SEARCH APPLICATIONS

async function getAll(ctx) {
    //get user_ID from context (logged in user, return their applications)
    //if staff, show ALL applications
    const user_ID = 2;
    const result = await model.getAll(user_ID);
    if (result.length) {
        ctx.body = result;
    }
}

async function getById(ctx) {
    const id = ctx.params.id;
    const result = await model.getById(id);
    //console.log(result);
    if (result.appData.length) {
        const application = result.appData[0];
        const images = result.images;
        ctx.body = {application, images};
    }
}

async function createApplication(ctx) {
    const application = ctx.request.body;
    const result = await model.createApplication(application);
    if (result.affectedRows) {
        const id = result.Id;
        //console.log(result.insertId);
        ctx.status = 201;
        ctx.body = {ID: id, created : true, link : `${ctx.request.path}/${id}`};
    }
}

async function updateApplication(ctx) {
    const id = ctx.params.id;
    //Checking if application exists
    let result = await model.getById(id);
    if (result.length) {
        let application = result[0];
        const {ID, dateRegistered, ...body} = ctx.request.body;
        Object.assign(application,body);
        result = model.updateApplication(application);
        if (result.affectedRows) {
            ctx.body = {ID : id, updated: true};
        }
    }
}

async function removeApplication(ctx) {
    const id = ctx.params.id;
    let result = await model.removeApplication(id);
    if (result.affectedRows) {
        ctx.body = {ID : id, deleted : true};
    }
}


module.exports = router;