const db = require('../helpers/database');
const usersModel = require('./users.js'); //requires merge with master

exports.getAllChats = async function getAllChats(user_id) {
    //MAKE THIS SHOW JUST THE NAME OF THE USER THEY AHVE A CHAT WITH AND MAYBE THE LAST MESSAGE THEY HAD 
    
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
        //const query = "SELECT * FROM chat WHERE shelter_ID = ?;";
        //console.log('a');
        //JOIN QUERY for proper data displayed
        //staff members would want to see user data => username and name 
        //const query = "SELECT chat.ID, chat.shelter_ID, users.username, users.firstName, users.lastName FROM users JOIN chat ON (users.ID = chat.user_ID) WHERE chat.shelter_ID = ?;";


        //REFERENCE STACK OVERFLOW RESPONSE FOR THE SQL QUERY - Bill Karwin
        //https://stackoverflow.com/questions/2111384/sql-join-selecting-the-last-records-in-a-one-to-many-relationship
        //msg_content either null or empty string
        const query = `
            SELECT c.ID AS chat_ID, u.username, u.firstName, u.lastName, IFNULL(cm.message_content, '') AS last_message
            FROM users AS u
            JOIN chat AS c ON (u.ID = c.user_ID)
            LEFT JOIN (
                SELECT chat_ID, MAX(date_sent) AS max_date
                FROM chat_message
                GROUP BY chat_ID
            ) AS lm ON (c.ID = lm.chat_ID)
            LEFT JOIN chat_message AS cm ON (lm.chat_ID = cm.chat_ID AND lm.max_date = cm.date_sent)
            WHERE c.shelter_ID = ?;
        `;

        const values = userData[0].ID;
        //console.log(userData);
        //console.log(values);
        const data = await db.run_query(query,values); //values
        //console.log(data);
        //console.log('a');
        //GET LAST MESSAGE CHAT_ID + dateSent
        //need last entry in table where chat_ID = ?
        /*
        const lastMsgQuery = "SELECT * FROM chat_message ORDER BY ID DESC LIMIT 1 WHERE chat_ID = ?"; //broken query, unidentified chat_ID because of promise?? idk yet
        const chat_ID = data.ID;
        const lastMsg = await db.run_query(lastMsgQuery, chat_ID);
        console.log(lastMsg);
        */
        return data;
    }
    //show chats for user
    //const query = "SELECT * FROM chat WHERE user_ID = ?;";
    //JOIN QUERY

    //const query = "SELECT chat.ID, users.username, users.firstName, users.lastName FROM users JOIN chat ON (users.ID = chat.user_ID) WHERE chat.user_ID = ?;";
    //console.log('b');
    //users would want to know which shelters theyre talking to
    //const query = "SELECT chat.ID, shelters.location FROM shelters JOIN chat ON (shelters.ID = chat.shelter_ID) WHERE chat.user_ID = ?;";
    //u->s   user_ID -> shelter_ID
    const query = `
    SELECT c.ID AS chat_ID, s.location, IFNULL(cm.message_content, '') AS last_message
    FROM shelters AS s
    JOIN chat AS c ON (s.ID = c.shelter_ID)
    LEFT JOIN (
        SELECT chat_ID, MAX(date_sent) AS max_date
        FROM chat_message
        GROUP BY chat_ID
    ) AS lm ON (c.ID = lm.chat_ID)
    LEFT JOIN chat_message AS cm ON (lm.chat_ID = cm.chat_ID AND lm.max_date = cm.date_sent)
    WHERE c.user_ID = ?;
`;
    

    //last msg+dateSent


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