const db = require('../helpers/database');
const usersModel = require('./users.js'); //requires merge with master

exports.getAllStaff = async function getAllStaff(user_id, isStaff) {  
    //PERFORM CHECK ON USER ROLE
    //if user_role == user, search the chat table by user_ID
    //if user_role == staff/admin, search the chat table by staff_ID

    //maybe change this when the role management system is implemented 
    //needs a role

    //JOIN QUERY for proper data displayed
    //staff members would want to see user data => username and name 

    //REFERENCE STACK OVERFLOW RESPONSE FOR THE SQL QUERY - Bill Karwin
    //https://stackoverflow.com/questions/2111384/sql-join-selecting-the-last-records-in-a-one-to-many-relationship
    //msg_content either null or empty string
    const query = `
        SELECT c.ID AS chat_ID, u.username, u.firstName, u.lastName, IFNULL(cm.message_content, '') AS last_message
        FROM users AS u
        JOIN chats AS c ON (u.ID = c.user_ID)
        LEFT JOIN (
            SELECT chat_ID, MAX(date_sent) AS max_date
            FROM chat_messages
            GROUP BY chat_ID
        ) AS lm ON (c.ID = lm.chat_ID)
        LEFT JOIN chat_messages AS cm ON (lm.chat_ID = cm.chat_ID AND lm.max_date = cm.date_sent)
        WHERE c.staff_ID = ?;
    `;

    const values = [user_id];
    const data = await db.run_query(query,values); //values
    return data;
}


exports.getAllUser = async function getAllUser(user_id) {  
    //show chats for user

    const query = `
        SELECT c.ID AS chat_ID, u.username, u.firstName, u.lastName, IFNULL(cm.message_content, '') AS last_message
        FROM users AS u
        JOIN chats AS c ON (u.ID = c.user_ID)
        LEFT JOIN (
            SELECT chat_ID, MAX(date_sent) AS max_date
            FROM chat_messages
            GROUP BY chat_ID
        ) AS lm ON (c.ID = lm.chat_ID)
        LEFT JOIN chat_messages AS cm ON (lm.chat_ID = cm.chat_ID AND lm.max_date = cm.date_sent)
        WHERE c.user_ID = ?;
    `;

    values = [user_id]
    const data = await db.run_query(query, values);
    //console.log(data);
    return data;
}

exports.createChat = async function createChat(chat) {
    query = "INSERT INTO chats SET ?;";
    data = await db.run_query(query, chat);
    return data;
}

exports.getById = async function getById(chat_id) {
    query = "SELECT * FROM chat_messages WHERE chat_ID = ?;";
    values = [chat_id];
    data = await db.run_query(query, values);
    return data;
}

exports.createMessage = async function createMessage(message) {
    query = "INSERT INTO chat_messages SET ?;";
    data = await db.run_query(query, message);
    return data;

}

exports.removeMessage = async function removeMessage(message_id) {
    query = "DELETE FROM chat_messages WHERE message_ID = ?;";
    values = [message_id];
    data = await db.run_query(query, values);
    return data;
}

exports.getPending = async function getPending() {
    return null;
}

exports.aaaaaa = async function aaaaaa() {
    return null;
}