/**
 * Module representing all functionalities to interact with the users table in the DB.
 * @module models/users
 * @author Petar Drumev
 * @see routes/users for the route that requires these methods
 */

const db = require('../helpers/database');
const bcrypt = require('bcrypt');

//getbyid, getall, createuser, updateuser, deleteuser

/**
 * Get specific user instance, along with the roles they posses.
 * @param {number} id - The user records unique identifier in the DB
 * @returns {object} - Object representing a user
 */
exports.getById = async function getById (id) {
    //const query = "SELECT * FROM users WHERE ID = ?;";
    const query = 'SELECT roles.name AS role, users.* FROM users JOIN users_roles ON (users.ID = users_roles.user_ID) JOIN roles ON (roles.ID = users_roles.role_ID) WHERE users_roles.user_ID = ?;';
    const values = [id];
    const data = await db.run_query(query, values);

    //maybe make a the roles attribute a list of all roles {[]} the user posseses (2 queries instead of a join cause joins are hard?)
    return data;
};

/**
 * Get specific user instance, along with the roles they posses, searching by username.
 * @param {string} username - The user records username, which is unique.
 * @returns {object} - Object representing a user
 */
exports.findByUsername = async function findByUsername (username) {
    let query = 'SELECT * FROM users WHERE username = ?;';
    //JOIN STATEMENT to put the role into the user object in ctx.state.user
    //const query = "SELECT roles.name AS role, users.* FROM users JOIN users_roles ON (users.ID = users_roles.user_ID) JOIN roles ON (roles.ID = users_roles.role_ID) WHERE users.username = ?;";
    let user = await db.run_query(query, username);

    //JOIN STATEMENT to put the role into the user object in ctx.state.user | helps with role validation
    //ISSUE IF USER HAS MULTIPLE ROLES -> only selects uppermost
    query = 'SELECT roles.name AS role, users.* FROM users JOIN users_roles ON (users.ID = users_roles.user_ID) JOIN roles ON (roles.ID = users_roles.role_ID) WHERE users_roles.user_ID = ?;';
    user = await db.run_query(query, user[0].ID);
    //console.log(user);
    return user;
};

/**
 * Get all users from the DB.
 * @returns {object} - Indexable container, where each index represents a user
 */
exports.getAll = async function getAll () {
    const query = 'SELECT * FROM users;';
    const data = await db.run_query(query);
    return data;
};

/*
//Replaced by createUser
exports.addUser = async function addUser(user) {
    const query = "INSERT INTO users SET ?;";
    const data = await db.run_query(query, user);
    console.log(data);
    return data;
}
*/

/**
 * Update an existing user record in the DB.
 * @param {object} user - Object representing a user, not necessarily containing all attributes
 * @returns {object} - Information about the executed query
 */
exports.updateUser = async function updateUser (user) {
    const query = 'UPDATE users SET ? WHERE ID = ?;';
    const values = [user, user.ID];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * Delete existing user. Remove existing record from the users table in the DB.
 * @param {number} user_id - The user records unique identifier in the DB
 * @returns {object} - Information about the executed query
 */
exports.removeUser = async function removeUser (id) {
    const values = [id];

    //remove foreign key dependencies
    let query = 'DELETE FROM users_roles WHERE user_ID = ?';
    await db.run_query(query, values);

    //remove user
    query = 'DELETE FROM users WHERE ID = ?;';
    const data = await db.run_query(query, values);
    return data;
};

//ROLES

/**
 * Get all roles a user posseses.
 * @param {number} user_id - The user records unique identifier in the DB
 * @returns {object} - Indexable container, where each index represents a role
 */
exports.getUserRoles = async function getUserRoles (user_id) {
    //const query = "SELECT * FROM users_roles WHERE user_ID = ?;";
    const query = 'SELECT roles.* FROM roles JOIN users_roles ON (roles.ID = users_roles.role_ID) WHERE users_roles.user_ID = ?;';
    //const query = "SELECT roles."
    const values = [user_id];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * Assign a role to a user. Insert a new record into the users_roles table.
 * @param {number} user_id - The user records unique identifier in the DB
 * @param {number} role_id - The role records unique identifier in the DB
 * @returns {object} - Information about the executed query
 */
exports.assignUserRole = async function assignUserRole (user_id, role_id) {
    const query = 'INSERT INTO users_roles (user_ID,role_ID) VALUES (?, ?);';
    const values = [user_id, role_id];
    const data = await db.run_query(query, values);
    //console.log(query);
    //console.log(data);
    return data;
};

/**
 * Checks is user has a certain role.
 * @param {number} user_id - The user records unique identifier in the DB
 * @param {number} role_id - The role records unique identifier in the DB
 * @returns {object} - Object representing a role IF the user posseses the role
 */
exports.hasRole = async function hasRole (user_id, role_id) {
    const query = 'SELECT * FROM users_roles WHERE user_ID = ? AND role_ID = ?;';
    const values = [user_id, role_id];
    const data = await db.run_query(query, values);
    return data.length > 0;
};

/**
 * Remove role form a user. Delete an existing record from the users_roles table.
 * @param {number} user_id - The user records unique identifier in the DB
 * @param {number} role_id - The role records unique identifier in the DB
 * @returns {object} - Information about the executed query
 */
exports.removeUserRole = async function removeUserRole (user_id, role_id) {
    const query = 'DELETE FROM users_roles WHERE user_ID = ? AND role_ID = ?;';
    const values = [user_id, role_id];
    const data = await db.run_query(query, values);
    return data;
};

//LOGIN & REGISTER

//Password check
//password check should only be done in the login route, as then a token is assigned to the user....obviously

/**
 * Compares the password the user has given to the one stored in the DB.
 * @param {object} user - Object representing a user. It contains the password stored in the DB
 * @param {string} password - The password the user provided in the login request
 * @returns {boolean} - Boolean representing whether the passwords match.
 */
exports.verifyPass = async function verifyPass (user, password) {
    const isMatch = bcrypt.compareSync(password, user.password);
    //console.log(isMatch);
    return isMatch;
};

exports.login = async function login () {
    return null;
};

/**
 * Create new user. Insert new record into the users table.
 * @param {object} user - Object representing a user, containing all of the users attributes.
 * @returns {object} - Information about the executed query
 */
exports.createUser = async function createUser (user) {
    let query = 'INSERT INTO users SET ?';
    const password = user.password;
    const hash = bcrypt.hashSync(password, 10);
    user.password = hash;
    //CREATE USER
    const data = await db.run_query(query, user);
    //ASSIGN USER DEFAULT USER ROLE
    query = 'INSERT INTO users_roles SET ?;';
    //console.log(data);
    const values = { user_ID: data.insertId, role_ID: 3 };
    await db.run_query(query, values);
    //console.log(roles);
    return data;
};
