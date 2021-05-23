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
  .grant('administator')
  .execute('read')
  .on('user');

ac
  .grant('administator')
  .execute('read')
  .on('users');

ac
  .grant('administator')
  .execute('update')
  .on('user');

ac
  .grant('administator')
  .condition({Fn:'NOT_EQUALS', args: {'requester':'$.owner'}})
  .execute('delete')
  .on('user');


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