const AccessControl = require('role-acl');
const ac = new AccessControl();

ac
    .grant('user')
    .condition({ Fn: 'EQUALS', args: { requester: '$.chatUser_ID' } })
    .execute('read')
    .on('chat');

ac
    .grant('staff')
    .condition({ Fn: 'EQUALS', args: { requester: '$.chatStaff_ID' } })
    .execute('read')
    .on('chat');

ac
    .grant('administrator')
    .execute('read')
    .on('chat');

ac
    .grant('staff')
    .execute('read')
    .on('chats')
    .grant('administrator')
    .extend('staff');

ac
    .grant('staff')
    .execute('read')
    .on('chatsPending')
    .grant('administrator')
    .extend('staff');

ac
    .grant('staff')
    .execute('update')
    .on('chatsPending')
    .grant('administrator')
    .extend('staff');

ac
    .grant('staff')
    .execute('delete')
    .on('chat')
    .grant('administrator')
    .extend('staff');

ac
    .grant('staff')
    .execute('delete')
    .on('chatMessage')
    .grant('administrator')
    .extend('staff');

exports.readAll = (requester) => {
    return ac
        .can(requester.role)
    //.context({requester:requester.ID, owner:data.ID})
        .execute('read')
        .sync()
        .on('chats');
};

exports.read = (requester, data) => {
    return ac
        .can(requester.role)
        .context({ requester: requester.ID, chatUser_ID: data.user_ID, chatStaff_ID: data.staff_ID })
        .execute('read')
        .sync()
        .on('chat');
};

exports.readPending = (requester) => {
    return ac
        .can(requester.role)
        .execute('read')
        .sync()
        .on('chatsPending');
};

exports.updatePending = (requester) => {
    return ac
        .can(requester.role)
        .execute('update')
        .sync()
        .on('chatsPending');
};

exports.delete = (requester) => {
    return ac
        .can(requester.role)
        .execute('delete')
        .sync()
        .on('chat');
};

exports.deleteMessage = (requester) => {
    return ac
        .can(requester.role)
        .execute('delete')
        .sync()
        .on('chatMessage');
};
