const AccessControl = require('role-acl');
const ac = new AccessControl();


ac
  .grant('user')
    .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
    .execute('read')
    .on('user', ['*', '!password']);

ac
  .grant('user')
    .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
    .execute('update')
    .on('user', ['firstName', 'lastName', 'about', 'password', 'email', 'avatarURL']);

ac
  .grant('user')
    .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
    .execute('delete')
    .on('user');

ac
  .grant('staff')
    .execute('read')
    .on('user')
  .grant('administrator')
    .extend('staff');

ac
  .grant('staff')
    .execute('read')
    .on('users')
  .grant('administrator')
    .extend('staff');

ac
  .grant('staff')
    .execute('update')
    .on('user')
  .grant('administrator')
    .extend('staff');
ac
  .grant('staff')
    .condition({Fn:'NOT_EQUALS', args: {'requester':'$.owner'}}) //not sure about this
    .execute('delete')
    .on('user')
  .grant('administrator')
    .extend('staff');


ac
  .grant('administrator')
    .execute('read')
    .on('user_roles');

ac
  .grant('administrator')
    .execute('read')
    .on('user_role');

ac
.grant('administrator')
  .execute('update')
  .on('user_role');

ac
.grant('administrator')
  .execute('delete')
  .on('user_role');

exports.readAll = (requester) => {
    return ac
      .can(requester.role)
      .execute('read')
      .sync()
      .on('users');
  }
  
exports.read = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('read')
    .sync()
    .on('user');
}

exports.update = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('update')
    .sync()
    .on('user');
}

exports.delete = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data})
    .execute('delete')
    .sync()
    .on('user');
}

exports.readAllRoles = (requester) => {
  return ac
    .can(requester.role)
    .execute('read')
    .sync()
    .on('user_role');
}

exports.assignRole = (requester) => {
  return ac
    .can(requester.role)
    .execute('update')
    .sync()
    .on('user_role');
}

exports.deleteRole = (requester) => {
  return ac
    .can(requester.role)
    .execute('delete')
    .sync()
    .on('user_role');
}

