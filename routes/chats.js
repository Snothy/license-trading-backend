const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/chats');
const auth = require('../controllers/auth');
const can = require('../permissions/chats');

const { validateCreateMessage, validateCreateChat } = require('../controllers/validation');

//CHATS tab
//user contacts a shelter where the dog is, the staff that is currently available at work (on their account) have access to that chat (staff users see all chats
//for the shelter they work for)
//this way even if the conversation continues on a different shift, they have access to all messages for context

//if initialize chat is pressed, perform a check to see if those users already have a chat before attempting to create a 'new' chat between them

const router = Router({ prefix: '/api/chats' });

router.get('/', auth, getAllChats); //perform role check and list all instances of chats the user belongs to
router.post('/', auth, bodyparser(), validateCreateChat, createChat); //create new chat between user and shelter (done at shelter/:id uri to get the shelters id)
router.del('/:id([0-9]{1,})', auth, bodyparser(), removeChat);
//create delete chat feature that deletes the chat after X amount of time of inactivity

router.get('/:id([0-9]{1,})', auth, getById); //using the chat_ID we find & list all chat messages that belong to that chat
router.post('/:id([0-9]{1,})', auth, bodyparser(), validateCreateMessage, createMessage); //add chat message to chat_ID from user_ID
router.del('/removeMessage', auth, bodyparser(), removeMessage); //staff can remove messages | requires the chat_message_ID, not the chat_ID

router.get('/pending', auth, getPending); //Get all unanswered chat requests
router.put('/pending', auth, bodyparser(), changeStatus); //Set staff_ID in chats table to staff member to picked up the chat request

async function getAllChats (ctx) {
    const user = ctx.state.user;

    const permission = can.readAll(user);
    //using this as a role check in this case
    //FIX FIRSTNAME AND LASTNAME IN THE JOIN QUERY
    //SHOULD SHOW THE OPPOSING(if user-> staff name), NOT JUST USER

    //if user
    if (!permission.granted) {
        const result = await model.getAllUser(user.ID);
        //console.log('a');
        if (result.length) {
            return ctx.body = result;
        }

    //if admin
    } else {
        const result = await model.getAllStaff(user.ID);
        //console.log('b');
        if (result.length) {
            return ctx.body = result;
        }
    }
}

async function createChat (ctx) {
    const chat = { user_ID: ctx.state.user.ID, staff_ID: null };
    const result = await model.createChat(chat);

    //HANDLE EXCEPTION IF CHAT ALREADY EXISTS

    if (result.affectedRows) {
        const id = result.ID;
        ctx.status = 201;
        ctx.body = { ID: id, created: true };
    }
}

async function removeChat (ctx) {
    const chat_id = ctx.params.id;

    //perms check, only admins can remove chats
    const permission = can.delete(ctx.state.user);
    if (!permission.granted) {
        return ctx.status = 403;
    }

    const result = await model.removeChat(chat_id);
    if (result.affectedRows) {
        ctx.status = 200;
        return ctx.body = { ID: chat_id, deleted: true };
    }
}

async function getById (ctx) {
    const chat_id = ctx.params.id;
    const chat = await model.getChatById(chat_id);

    //Permission Check
    //user can access if user_id matches, staff can access if staff_id matches
    //administrators have access to all chats
    const permission = can.read(ctx.state.user, chat[0]);
    if (!permission.granted) {
        return ctx.status = 403;
    }

    const result = await model.getById(chat_id);
    //console.log(result);
    if (result.length) {
        const chat_messages = result;
        return ctx.body = chat_messages;
    }
}

async function createMessage (ctx) {
    //does not require role check
    const user_id = ctx.state.user.ID;

    const chat_id = ctx.params.id;
    const message_content = Object.values(ctx.request.body); //message is an object {message_content : "message"}

    const message = { chat_ID: chat_id, user_ID: user_id, message_content };
    const result = await model.createMessage(message);
    if (result.affectedRows) {
        ctx.status = 201;
        const chatMessage = await model.getMessageById(result.insertId);
        return ctx.body = { ID: chat_id, created: true, chatMessage: chatMessage };
    }
}

async function removeMessage (ctx) {
    const message_id = ctx.request.body.message_id;

    const permission = can.deleteMessage(ctx.state.user);
    if (!permission.granted) {
        return ctx.status = 403;
    }

    const result = await model.removeMessage(message_id);
    if (result.affectedRows) {
        ctx.status = 200;
        return ctx.body = { ID: message_id, deleted: true };
    }
}

async function getPending (ctx) {
    const permission = can.readPending(ctx.state.user);
    if (!permission.granted) {
        return ctx.status = 403;
    }
    const result = await model.getPending();
    return ctx.body = result;
}

async function changeStatus (ctx) {
    const permission = can.updatePending(ctx.state.user);
    //console.log(permission);
    if (!permission.granted) {
        return ctx.status = 403;
    }

    const { chat_ID, status } = ctx.request.body;
    //this gives the chat to a staff member and changes the chat status from pending(1) to in progress(2)
    const result = await model.changeStatus(chat_ID, ctx.state.user.ID, status);
    if (result.affectedRows) {
        ctx.status = 200;
        return ctx.body = { ID: chat_ID, updated: true };
    }
}

module.exports = router;
