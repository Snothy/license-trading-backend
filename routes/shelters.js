const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/shelters');

const router = Router({prefix : '/api/shelters'});

//ONLY TESTED GETALL, GETBYID, POST
router.get('/', getAll);
router.post('/', bodyparser(), addShelter);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyparser(), updateShelter);
router.del('/:id([0-9]{1,})', bodyparser(), removeShelter);

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
        const shelter = result[0];
        ctx.body = shelter;
    }
}

async function addShelter(ctx) {
    const shelter = ctx.request.body;
    const result = await model.addShelter(shelter);
    if (result.affectedrows) {
        const id = result.Id;
        console.log(result.insertId);
        ctx.status = 201;
        ctx.body = {ID: id, created : true, link : `${ctx.request.path}/${id}`};
    }
}

async function updateShelter(ctx) {
    const id = ctx.params.id;
    //Checking if user exists
    let result = await model.getById(id);
    if (result.length) {
        let shelter = result[0];
        const {ID, ...body} = ctx.request.body;
        Object.assign(shelter, body);
        result = model.updateShelter(shelter);
        if (result.affectedrows) {
            ctx.body = {ID : id, deleted: true};
        }
    }
}

async function removeShelter(ctx) {
    const id = ctx.params.id;
    let result = await model.removeShelter(id);
    if (result.affectedrows) {
        ctx.body = {ID : id, deleted : true};
    }
}

module.exports = router;