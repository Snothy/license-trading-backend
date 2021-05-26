const {Validator, ValidationError} = require('jsonschema');

const userSchema = require('../schemas/user.json');

const validator = function(schema, resource) {
    const v = new Validator();
    const validationOptions = {
        throwError: true,
        propertyName: resource
      };
    const handler = async function(ctx, next) {
        const body = ctx.request.body;

        try {
            v.validate(body, schema, validationOptions);
            await next();
        } catch (err) {
            if(err instanceof ValidationError) {
                console.log(err);
                ctx.status = 400;
                ctx.body = err;
            } else {
                throw error;
            }

        }
    }
    return handler;
}

exports.validateUser = validator(userSchema, 'user')