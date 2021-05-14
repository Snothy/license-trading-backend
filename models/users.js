const db = require('../helpers/database');

//getbyid, getall, createuser, updateuser, deleteuser

exports.getById = async function getById(id) {
    const query = "SELECT * FROM users WHERE ID = ?;";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;
}

exports.getAll = async function getAll() {
    const query = "SELECT * FROM users;";
    const data = await db.run_query(query);
    return data;
}

exports.addUser = async function addUser(user) {
    const query = "INSERT INTO users SET ?;";
    const data = db.run_query(query, user);
    return data;
}

exports.updateUser = async function updateUser(user) {
    const query = "UPDATE users SET ? WHERE ID = ?;";
    const values = [user, user.ID];
    const data = db.run_query(query, values);
    return data;
}

exports.removeUser = async function removeUser(id) {
    const query = "DELETE FROM users WHERE ID = ?;";
    const values = [id];
    const data = db.run_query(query, values);
    return data;
}


//FAVOURITES
exports.getFavourites = async function getFavourites(id) {
    return null;
}

exports.setFavourites = async function setFavourites(id) {
    return null;
}


//ROLES
exports.assignUserRole = async function assignUserRole(user_id, role_id) {
    const query = "INSERT INTO users_roles (user_ID,role_ID) VALUES (?, ?);";
    const values = [user_id, role_id];
    const data = db.run_query(query, values);
    //console.log(query);
    //console.log(values);
    return data;
}

exports.removeUserRole = async function removeUserRole(user_id, role_id) {
    const query = "DELETE FROM users_roles WHERE (user_ID, role_ID) VALUES (?, ?);";
    const values = [user_id, role_id];
    const data = db.run_query(query, values);
    return data;
}