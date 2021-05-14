const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/users');

const router = Router({prefix : '/api/users'});

//Create, modify, remove, assign role to user, modify user roles