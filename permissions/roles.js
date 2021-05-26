const AccessControl = require('role-acl');
const ac = new AccessControl();

ac
    .grant('administrator')
    .execute('read')
    .on('roles');

ac
    .grant('administrator')
    .execute('read')
    .on('role');

ac
    .grant('administrator')
    .execute('update')
    .on('role');

ac
    .grant('administrator')
    .execute('remove')
    .on('role');

ac
    .grant('administrator')
    .execute('create')
    .on('role');

//define user and staff so we dont get any errors when they try to access the route, but isntead they get a 403 status code
ac
    .grant('user')
    .execute('something')
    .on('something')
    .grant('staff')
    .extend('user');

const readAll = (requester) => {
    return ac
        .can(requester.role)
        .execute('read')
        .sync()
        .on('roles');
};

const read = (requester) => {
    return ac
        .can(requester.role)
        .execute('read')
        .sync()
        .on('role');
};

const update = (requester) => {
    return ac
        .can(requester.role)
        .execute('update')
        .sync()
        .on('role');
};

const remove = (requester) => {
    return ac
        .can(requester.role)
        .execute('remove')
        .sync()
        .on('role');
};

const create = (requester) => {
    return ac
        .can(requester.role)
        .execute('create')
        .sync()
        .on('role');
};

const roleMiddleware = function (aControl) {
    const handler = async function (ctx, next) {
        //console.log(ctx.state.user);
        const user = ctx.state.user;
        try {
            const permission = aControl(user);
            ///console.log(permission);
            if (!permission.granted) {
                return ctx.status = 403;
            } else {
                return next();
            }
        } catch (err) {
            if (err instanceof ac) {
                console.error(err);
                ctx.status = 400;
                ctx.body = err;
            } else {
                throw err;
            }
        }
    };
    return handler;
};

exports.readAll = roleMiddleware(readAll);
exports.read = roleMiddleware(read);
exports.update = roleMiddleware(update);
exports.remove = roleMiddleware(remove);
exports.create = roleMiddleware(create);
