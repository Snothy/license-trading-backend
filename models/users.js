const db = require('../helpers/database');
const bcrypt = require('bcrypt');

//getbyid, getall, createuser, updateuser, deleteuser

exports.getById = async function getById(id) {
    const query = "SELECT * FROM users WHERE ID = ?;";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;
}

exports.findByUsername = async function findByUsername(username) {
    const query = "SELECT * FROM users WHERE username = ?;";
    const user = await db.run_query(query, username);
    return user;
}

exports.getAll = async function getAll() {
    const query = "SELECT * FROM users;";
    const data = await db.run_query(query);
    return data;
}

/*
//Replaced by createUser
exports.addUser = async function addUser(user) {
    const query = "INSERT INTO users SET ?;";
    const data = await db.run_query(query, user);
    console.log(data);
    return data;
}
*/

exports.updateUser = async function updateUser(user) {
    const query = "UPDATE users SET ? WHERE ID = ?;";
    const values = [user, user.ID];
    const data = await db.run_query(query, values);
    return data;
}

exports.removeUser = async function removeUser(id) {
    const query = "DELETE FROM users WHERE ID = ?;";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;
}


//ROLES

exports.getUserRoles = async function getUserRoles(user_id) {
    //const query = "SELECT * FROM users_roles WHERE user_ID = ?;";
    const query = "SELECT roles.* FROM roles JOIN users_roles ON (roles.ID = users_roles.role_ID) WHERE users_roles.user_ID = ?;";
    //const query = "SELECT roles."
    values = [user_id];
    const data = await db.run_query(query, values);
    return data;
}


exports.assignUserRole = async function assignUserRole(user_id, role_id) {
    const query = "INSERT INTO users_roles (user_ID,role_ID) VALUES (?, ?);";
    const values = [user_id, role_id];
    const data = await db.run_query(query, values);
    //console.log(query);
    //console.log(data);
    return data;
}

exports.hasRole = async function hasRole(user_id, role_id){ 
    const query = "SELECT * FROM users_roles WHERE user_ID = ? AND role_ID = ?;";
    const values = [user_id, role_id];
    const data = await db.run_query(query, values);
    return data.length>0;
}


exports.removeUserRole = async function removeUserRole(user_id, role_id) {
    const query = "DELETE FROM users_roles WHERE user_ID = ? AND role_ID = ?;";
    const values = [user_id, role_id];
    const data = await db.run_query(query, values);
    return data;
}

//LOGIN & REGISTER

//Password check
//password check should only be done in the login route, as then a token is assigned to the user....obviously
exports.verifyPass = async function verifyPass(user,password) {
    const isMatch = bcrypt.compareSync(password, user.password);
    //console.log(isMatch);
    return isMatch;
}

exports.login = async function login() {
    return null;
}

exports.createUser = async function createUser(user) {
    const query = "INSERT INTO users SET ?";
    const password = user.password;
    const hash = bcrypt.hashSync(password, 10);
    user.password = hash;
    const data = await db.run_query(query, user);
    return data;
}