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
    .on('roles');

ac
.grant('administrator')
    .execute('delete')
    .on('roles');

ac
.grant('administrator')
    .execute('create')
    .on('roles');


//define user and staff so we dont get any errors when they try to access the route, but isntead they get a 403 status code
ac
  .grant('user')
    .execute('something')
    .on('something')
  .grant('staff')
    .extend('user')

    
exports.readAll = (requester) => {
    return ac
        .can(requester.role)
        .execute('read')
        .sync()
        .on('roles');
    }

    exports.read = (requester) => {
    return ac
        .can(requester.role)
        .execute('read')
        .sync()
        .on('role');
    }

    exports.update = (requester) => {
    return ac
        .can(requester.role)
        .execute('update')
        .sync()
        .on('role');
    }

    exports.delete = (requester) => {
    return ac
        .can(requester.role)
        .execute('delete')
        .sync()
        .on('role');
    }

    exports.create = (requester) => {
    return ac
        .can(requester.role)
        .execute('create')
        .sync()
        .on('role');
    }