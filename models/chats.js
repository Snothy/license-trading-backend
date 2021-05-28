const db = require('../helpers/database');

exports.getAllStaff = async function getAllStaff (user_id, isStaff) {
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
    const data = await db.run_query(query, values); //values
    return data;
};

exports.getAllUser = async function getAllUser (user_id) {
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

    const values = [user_id];
    const data = await db.run_query(query, values);
    //console.log(data);
    return data;
};

exports.createChat = async function createChat (chat) {
    const query = 'INSERT INTO chats SET ?;';
    const data = await db.run_query(query, chat);
    return data;
};

exports.removeChat = async function removeChat (chat_id) {
    let query = 'DELETE FROM chat_messages WHERE chat_ID = ?';
    await db.run_query(query, chat_id);

    query = 'DELETE FROM chats WHERE ID = ?';
    const data = await db.run_query(query, chat_id);
    return data;
};

exports.getChatById = async function getChatById (chat_id) {
    const query = 'SELECT * FROM chats WHERE ID = ?;';
    const values = [chat_id];
    const data = await db.run_query(query, values);
    return data;
};

exports.getChatByUserId = async function getChatByUserId (user_id) {
    const query = 'SELECT * FROM chats WHERE user_ID = ?;';
    const values = [user_id];
    const data = await db.run_query(query, values);
    return data;
};

exports.getById = async function getById (chat_id) {
    const query = 'SELECT * FROM chat_messages WHERE chat_ID = ?;';
    const values = [chat_id];
    const data = await db.run_query(query, values);
    return data;
};

exports.createMessage = async function createMessage (message) {
    const query = 'INSERT INTO chat_messages SET ?;';
    const data = await db.run_query(query, message);
    return data;
};

exports.getMessageByUserId = async function getMessageByUserId (user_id) {
    const query = 'SELECT * FROM chat_messages WHERE user_ID = ?;';
    const values = [user_id];
    const data = await db.run_query(query, values);
    return data;
};

exports.removeMessage = async function removeMessage (message_id) {
    const query = 'DELETE FROM chat_messages WHERE ID = ?;';
    const values = [message_id];
    const data = await db.run_query(query, values);
    return data;
};

exports.getPending = async function getPending () {
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
        WHERE c.status = 1;
    `;
    const data = await db.run_query(query);
    return data;
};

exports.changeStatus = async function changeStatus (chat_ID, staff_ID) {
    const query = 'UPDATE chats SET ? WHERE ID = ?;';
    const values = [{ staff_ID: staff_ID, status: 2 }, chat_ID]; //change chat status to "inProgress" (no longer pending review)
    const data = await db.run_query(query, values);
    return data;
};