const db = require('../helpers/database');
const usersModel = require('./users.js'); //requires merge with master

exports.getAllChats = async function getAllChats(user_id) {
    //PERFORM CHECK ON USER ROLE
    //if user_role == user, search the chat table by user_id
    //if user_role == staff/admin, search the chat table by shelter_id

    //maybe change this when the role management system is implemented 
    //needs a role AND shelter check
    const userData = await usersModel.getUserShelters(user_id); //if user works for a shelter -> get all chats for shelter | if not, get all chats for user
    //console.log(userData);
    //console.log('aaaa')
    if(userData.length) {
        //show chats for shelter
        const query = "SELECT * FROM chat WHERE shelter_ID = ?;";
        const values = userData[0].shelter_ID;
        //console.log(values);
        const data = await db.run_query(query,values);
        return data;
    }
    //show chats for user
    const query = "SELECT * FROM chat WHERE user_ID = ?;";
    values = [user_id]
    const data = await db.run_query(query, values);
    return data;
}

exports.createChat = async function createChat(chat) {
    //maybe on shelter/:id level
    query = "INSERT INTO chat SET ?;";
    data = await db.run_query(query, chat);
    return data;
}

exports.getById = async function getById(chat_id) {
    query = "SELECT * FROM chat_message WHERE chat_ID = ?;";
    values = [chat_id];
    data = await db.run_query(query, values);
    return data;
}

exports.createMessage = async function createMessage(message) {
    query = "INSERT INTO chat_message SET ?;";
    data = await db.run_query(query, message);
    return data;

}

exports.removeMessage = async function removeMessage(message_id) {
    query = "DELETE FROM chat_message WHERE message_ID = ?;";
    values = [message_id];
    data = await db.run_query(query, values);
    return data;
}