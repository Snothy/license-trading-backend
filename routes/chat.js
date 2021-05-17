const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const model = require('../models/chat');

//CHATS tab
//user contacts a shelter where the dog is, the staff that is currently available at work (on their account) have access to that chat (staff users see all chats
//for the shelter they work for)
//this way even if the conversation continues on a different shift, they have access to all messages for context

//if initialize chat is pressed, perform a check to see if those users already have a chat before attempting to create a 'new' chat between them

const router = Router({prefix : '/api/chat'});

router.get('/', getAllChats);                                   //perform role check and list all instances of chats the user belongs to
router.post('/', bodyparser(), createChat);                     //create new chat between user and shelter (done at shelter/:id uri to get the shelters id)
//create delete chat feature that deletes the chat after X amount of time of inactivity

router.get('/:id([0-9]{1,})', getById);                         //using the chat_ID we find & list all chat messages that belong to that chat
router.post('/:id([0-9]{1,})', bodyparser(), createMessage);    //add chat message to chat_ID from user_ID
router.del('/:id([0-9]{1,})', bodyparser(), removeMessage);     //staff can remove messages | requires the chat_message_ID, not the chat_ID


async function getAllChats(ctx) {
    //get user_id from login context ->
    //hardcoded for testing
    //1 is admin, 5 is user
    const user_id = 5      //user_id = 6 is a staff member for shelter_id = 1 -> he sees all chats and chat messages related to shelter_id = 1 \o/
    //hardcoded for testing 

    const result = await model.getAllChats(user_id);
    if (result.length) {
        ctx.body = result;
    }
}

async function createChat(ctx) {
    //maybe at /shelters/:id level
    //need to get user_id from logged in user
    //need to get shelter/:id from ctx.params?

    //hardcoded for testing
    const chat = {user_ID : 5, shelter_ID : 2};
    //hardcoded for testing

    const result = await model.createChat(chat);

    //HANDLE EXCEPTION IF CHAT ALREADY EXISTS

    if (result.affectedRows) {
        const id = result.ID;
        ctx.status = 201;
        ctx.body = {ID: id, created : true, link : `${ctx.request.path}/${id}`};
    }
}

async function getById(ctx) {
    const chat_id = ctx.params.id;
    const result = await model.getById(chat_id);
    if (result.length) {
        const chat_messages = result;
        ctx.body = chat_messages;
    }
}

async function createMessage(ctx) {
    //get user_id from logged in context
    //hardcorded for testing
    const user_id = 1;
    //hardcoded for testing 

    const chat_id = ctx.params.id;
    const message_content = Object.values(ctx.request.body); //message is an object {message_content : "message"}
    //console.log(message_content)


    const message = {chat_ID : chat_id, user_ID : user_id, message_content};
    const result = await model.createMessage(message);
    if(result.affectedRows) {
        ctx.status = 201;
        ctx.body = {created : true};
    }
}

async function removeMessage(ctx) {
    const message_id = ctx.request.body; //not sure if its request.body for HTTP DELETE
    const result = await model.removeMessage(message_id);
    if(result.affectedRows) {
        ctx.body = {removed : true};
    }
}


module.exports = router;