const { Validator, ValidationError } = require('jsonschema');

const createUserSchema = require('../schemas/createUser.json');
const updateUserSchema = require('../schemas/updateUser.json');
const AoRroleSchema = require('../schemas/assignOrRemoveUserRole.json');
const createApplication = require('../schemas/createApplication.json');
const updateApplication = require('../schemas/updateApplication.json');
const createMessage = require('../schemas/createMessage.json');
const createChat = require('../schemas/createChat.json');
const createRole = require('../schemas/createRole.json');
const updateRole = require('../schemas/updateRole.json');

const validator = function (schema, resource) {
    const v = new Validator();
    const validationOptions = {
        throwError: true,
        propertyName: resource
    };
    const handler = async function (ctx, next) {
        const body = ctx.request.body;

        try {
            v.validate(body, schema, validationOptions);
            await next();
        } catch (err) {
            if (err instanceof ValidationError) {
                console.log(err);
                ctx.status = 400;
                ctx.body = err;
            } else {
                throw err;
            }
        }
    };
    return handler;
};

exports.validateCreateUser = validator(createUserSchema, 'user');
exports.validateUpdateUser = validator(updateUserSchema, 'user');
exports.validateAoRrole = validator(AoRroleSchema, 'user_roles');
exports.validateCreateApplication = validator(createApplication, 'application');
exports.validateUpdateApplication = validator(updateApplication, 'application');
exports.validateCreateMessage = validator(createMessage, 'chat');
exports.validateCreateChat = validator(createChat, 'chat');
exports.validateCreateRole = validator(createRole, 'chat');
exports.validateUpdateRole = validator(updateRole, 'chat');
