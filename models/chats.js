/**
 * Module representing all functionalities to interact with the chats and chat_messages tables in the DB.
 * @module models/chats
 * @author Petar Drumev
 * @see routes/chats for the route that requires these methods
 */

const db = require('../helpers/database');

/**
 * Get all chats a staff member is a part of.
 * @param {number} user_ID - The user records unique identifier in the DB
 * @returns {object} - Indexable container, where each index represents a chat
 */
exports.getAllStaff = async function getAllStaff (user_id) {
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
        SELECT c.ID AS chat_ID, u.username, u.firstName, u.lastName, c.status, IFNULL(cm.message_content, '') AS last_message
        FROM users AS u
        JOIN chats AS c ON (u.ID = c.user_ID)
        LEFT JOIN (
            SELECT chat_ID, MAX(date_sent) AS max_date
            FROM chat_messages
            GROUP BY chat_ID
        ) AS lm ON (c.ID = lm.chat_ID)
        LEFT JOIN chat_messages AS cm ON (lm.chat_ID = cm.chat_ID AND lm.max_date = cm.date_sent)
        WHERE c.staff_ID = ? AND status <> 3;
    `;

    const values = [user_id];
    const data = await db.run_query(query, values); //values
    return data;
};

/**
 * Get all chats a user is a part of.
 * @param {number} user_ID - The user records unique identifier in the DB
 * @returns {object} - Indexable container, where each index represents a chat
 */
exports.getAllUser = async function getAllUser (user_id) {
    //show chats for user

    const query = `
        SELECT c.ID AS chat_ID, u.username, u.firstName, u.lastName, c.status, IFNULL(cm.message_content, '') AS last_message
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

/**
 * Create new chat. Insert new record into the chats table.
 * @param {object} chat - Object representing a chat, containing a user_ID, staff_ID and status number.
 * @returns {object} - Information about the executed query
 */
exports.createChat = async function createChat (chat) {
    const query = 'INSERT INTO chats SET ?;';
    const data = await db.run_query(query, chat);
    return data;
};

/**
 * Delete existing chat. Remove existing record from the chats table.
 * @param {number} chat_id - The chat records unique identifier in the DB
 * @returns {object} - Information about the executed query
 */
exports.removeChat = async function removeChat (chat_id) {
    let query = 'DELETE FROM chat_messages WHERE chat_ID = ?';
    await db.run_query(query, chat_id);

    query = 'DELETE FROM chats WHERE ID = ?';
    const data = await db.run_query(query, chat_id);
    return data;
};

/**
 * Get specific chat instance.
 * @param {number} chat_id - The chat records unique identifier in the DB
 * @returns {object} - Object representing a chat
 */
exports.getChatById = async function getChatById (chat_id) {
    const query = 'SELECT * FROM chats WHERE ID = ?;';
    const values = [chat_id];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * Get specific chat instance by a users ID.
 * @param {number} user_id - The user records unique identifier in the DB
 * @returns {object} - Object representing a chat
 */
exports.getChatByUserId = async function getChatByUserId (user_id) {
    const query = 'SELECT * FROM chats WHERE user_ID = ?;';
    const values = [user_id];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * Get all chat messages in a chats ID.
 * @param {number} chat_id - The chat records unique identifier in the DB
 * @returns {object} - Object representing chat messages
 */
exports.getById = async function getById (chat_id) {
    const query = 'SELECT cm.ID, cm.chat_ID, users.username, users.firstName, users.lastName, cm.date_sent, cm.message_content FROM chat_messages AS cm JOIN users ON (users.ID = cm.user_ID) WHERE cm.chat_ID = ?;';
    const values = [chat_id];
    const data = await db.run_query(query, values);
    //console.log(data);
    return data;
};

/**
 * Get specific chat message.
 * @param {number} message_id - The chat records unique identifier in the DB
 * @returns {object} - Object representing a chat message
 */
exports.getMessageById = async function getMessageById (message_id) {
    const query = 'SELECT cm.ID, cm.chat_ID, users.username, users.firstName, users.lastName, cm.date_sent, cm.message_content FROM chat_messages AS cm JOIN users ON (users.ID = cm.user_ID) WHERE cm.ID = ?;';
    const values = [message_id];
    const data = await db.run_query(query, values);
    //console.log(data);
    return data;
};

/**
 * Create new chat message. Insert new record into the chat_messages table.
 * @param {object} message - Object representing a message, containing a user ID and the content of the message.
 * @returns {object} - Information about the executed query
 */
exports.createMessage = async function createMessage (message) {
    const query = 'INSERT INTO chat_messages SET ?;';
    const data = await db.run_query(query, message);
    return data;
};

/**
 * Get specific chat message instance by a users ID.
 * @param {number} user_id - The user records unique identifier in the DB
 * @returns {object} - Object representing a chat message
 */
exports.getMessageByUserId = async function getMessageByUserId (user_id) {
    const query = 'SELECT * FROM chat_messages WHERE user_ID = ?;';
    const values = [user_id];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * Delete existing chat message. Remove existing record from the chat_messages table.
 * @param {number} message_id - The chat message records unique identifier in the DB
 * @returns {object} - Information about the executed query
 */
exports.removeMessage = async function removeMessage (message_id) {
    const query = 'DELETE FROM chat_messages WHERE ID = ?;';
    const values = [message_id];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * Get all chats with a status number of 1 (pending), only accessible by admins
 * @returns {object} - Indexable container, where each index represents a chat
 */
exports.getPending = async function getPending () {
    const query = `
        SELECT c.ID AS chat_ID, u.username, u.firstName, u.lastName, c.status, IFNULL(cm.message_content, '') AS last_message
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

/**
 * Change a chats status number from pending(1) to in_progress(2)
 * @param {number} chat_id - The user records unique identifier in the DB
 * @param {number} staff_id - The user(staff) records unique identifier in the DB
 * @param {number} status - The chats status code
 * @returns {object} - Information about the executed query
 */
exports.changeStatus = async function changeStatus (chat_ID, staff_ID, status) {
    const query = 'UPDATE chats SET ? WHERE ID = ?;';
    const values = [{ staff_ID: staff_ID, status: status }, chat_ID]; //change chat status to "inProgress" (no longer pending review)
    //console.log(values);
    const data = await db.run_query(query, values);
    return data;
};
