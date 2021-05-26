const AccessControl = require('role-acl');
const ac = new AccessControl();

ac
  .grant('user')
    .execute('read')
    .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
    .on('application')

ac
  .grant('staff')
    .execute('read')
    .on('applications')
  .grant('administrator')
    .extend('staff');

ac
  .grant('staff')
    .execute('read')
    .on('application')
  .grant('administrator')
    .extend('staff')


ac
.grant('user')
    .execute('update')
    .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
    .on('application')

ac
.grant('staff')
    .execute('update')
    .on('application')
.grant('administrator')
    .extend('staff')


ac
.grant('user')
    .execute('delete')
    .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
    .on('application')

ac
.grant('staff')
    .execute('delete')
    .on('application')
.grant('administrator')
    .extend('staff')
  

exports.readAll = (requester) => {
    return ac
        .can(requester.role)
        //.context({requester:requester.ID, owner:data.ID})
        .execute('read')
        .sync()
        .on('applications');
    }

exports.read = (requester, data) => {
    return ac
        .can(requester.role)
        .context({requester:requester.ID, owner:data.user_ID})
        .execute('read')
        .sync()
        .on('application');
    }

exports.update = (requester, data) => {
    return ac
        .can(requester.role)
        .context({requester:requester.ID, owner:data.user_ID})
        .execute('update')
        .sync()
        .on('application');
    }

exports.delete = (requester, data) => {
    return ac
        .can(requester.role)
        .context({requester:requester.ID, owner:data.user_ID})
        .execute('delete')
        .sync()
        .on('application');
    }