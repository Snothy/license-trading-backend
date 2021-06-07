/**
 * Module that handles JSON Validation on requests.
 * @module controllers/validation
 * @author Petar Drumev
 * @see schemas/* for JSON Schema definitions
 */

const { Validator, ValidationError } = require('jsonschema');

const createUserSchema = require('../schemas/user.json').definitions.createUser;
const updateUserSchema = require('../schemas/user.json').definitions.updateUser;
const AoRroleSchema = require('../schemas/role.json').definitions.assignOrRemoveUserRole;
const createApplication = require('../schemas/application.json').definitions.createApplication;
const updateApplication = require('../schemas/application.json').definitions.updateApplication;
const createMessage = require('../schemas/chat.json').definitions.createMessage;
const createChat = require('../schemas/chat.json').definitions.createChat;
const createRole = require('../schemas/role.json').definitions.createRole;
const updateRole = require('../schemas/role.json').definitions.updateRole;
const logInUser = require('../schemas/user.json').definitions.logInUser;
//const removeChatMessage

/**
 * Wrapper function that returns a schema validator.
 * @param {object} schema - JSON schema definition
 * @param {string} resource - Name of URI path
 * @returns {function} - Koa middleware handler
 */
const validator = function (schema, resource) {
    const v = new Validator();
    const validationOptions = {
        throwError: true,
        propertyName: resource
    };
    /**
     * Middleware halndler that performs validation on a JSON schema file.
     * @param {object} ctx - Koa context object
     * @param {string} next - Koa callback function
     * @throws {ValidationError} Throws error from jsonschema library
     */
    const handler = async function (ctx, next) {
        const body = ctx.request.body;
        //console.log(body);

        try {
            v.validate(body, schema, validationOptions);
            await next();
        } catch (err) {
            if (err instanceof ValidationError) {
                //console.log(err);
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
exports.logInUser = validator(logInUser, 'user');
