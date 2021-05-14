const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/dogs');

const router = Router({prefix : '/api/dogs'});

//ONLY TESTED GETALL, GETBYID, POST
router.get('/', getAll);
router.post('/', bodyparser(), addDog);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyparser(), updateDog);
router.del('/:id([0-9]{1,})', bodyparser(), removeDog);

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
        const dog = result[0];
        ctx.body = dog;
    }
}

async function addDog(ctx) {
    const dog = ctx.request.body;
    const result = await model.addDog(dog);
    if (result.affectedRows) {
        const id = result.Id;
        console.log(result.insertId);
        ctx.status = 201;
        ctx.body = {ID: id, created : true, link : `${ctx.request.path}/${id}`};
    }
}

async function updateDog(ctx) {
    const id = ctx.params.id;
    //Checking if dog exists
    let result = await model.getById(id);
    if (result.length) {
        let dog = result[0];
        const {ID, dateRegistered, ...body} = ctx.request.body;
        Object.assign(dog,body);
        result = model.updateDog(dog);
        if (result.affectedRows) {
            ctx.body = {ID : id, updated: true};
        }
    }
}

async function removeDog(ctx) {
    const id = ctx.params.id;
    let result = await model.removeDog(id);
    if (result.affectedRows) {
        ctx.body = {ID : id, deleted : true};
    }
}

module.exports = router;