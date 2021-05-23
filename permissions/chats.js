const AccessControl = require('role-acl');
const ac = new AccessControl();



ac
  .grant('user')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('read')
  .on('chat');


ac
  .grant('administator')
  .execute('read')
  .on('chats');

ac
  .grant('administator')
  .execute('read')
  .on('chat');

ac
  .grant('administator')
  .execute('update')
  .on('chat');

ac
  .grant('administator')
  .condition({Fn:'NOT_EQUALS', args: {'requester':'$.owner'}})
  .execute('delete')
  .on('chat');



  exports.readAll = (requester) => {
    return ac
      .can(requester.role)
      //.context({requester:requester.ID, owner:data.ID})
      .execute('read')
      .sync()
      .on('chats');
  }
  
  exports.read = (requester, data) => {
    return ac
      .can(requester.role)
      .context({requester:requester.ID, owner:data.ID})
      .execute('read')
      .sync()
      .on('chat');
  }
  
  exports.update = (requester, data) => {
    return ac
      .can(requester.role)
      .context({requester:requester.ID, owner:data.ID})
      .execute('update')
      .sync()
      .on('chat');
  }
  
  exports.delete = (requester, data) => {
    return ac
      .can(requester.role)
      .context({requester:requester.ID, owner:data.ID})
      .execute('delete')
      .sync()
      .on('chat');
  }