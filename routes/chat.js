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

router.get('/:id([0-9]{1,})', getById);                         //using the chat_ID we find & list all chat messages that belong to that chat
router.post('/:id([0-9]{1,})', bodyparser(), createMessage);    //add chat message to chat_ID from user_ID
router.del('/:id([0-9]{1,})', bodyParser(), removeMessage);     //staff can remove messages | requires the chat_message_ID, not the chat_ID
