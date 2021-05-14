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

exports.getFavourites = async function getFavourites(id) {
    return null;
}

exports.setFavourites = async function setFavourites(id) {
    return null;
}

//SHELTERS
exports.getUserShelters = async function getUserShelters(user_id) {
    const query = "SELECT * FROM users_shelters WHERE user_ID = ?;";
    values = [user_id];
    const data = await db.run_query(query, values);
    return data;
}

exports.assignUserShelter = async function assignUserShelter(user_id, shelter_id) {
    const query = "INSERT INTO users_shelters (user_ID,shelter_ID) VALUES (?, ?);";
    const values = [user_id, shelter_id];
    //console.log(values);
    const data = await db.run_query(query, values);
    return data;
}

exports.hasShelter = async function hasShelter(user_id, shelter_id){
    const query = "SELECT * FROM users_shelters WHERE user_ID = ? AND shelter_ID = ?;";
    const values = [user_id, shelter_id];
    const data = await db.run_query(query, values);
    return data.length>0;
}

exports.removeUserShelter = async function removeUserShelter(user_id, shelter_id) {
    const query = "DELETE FROM users_shelters WHERE user_ID = ? AND shelter_ID = ?;";
    const values = [user_id, shelter_id];
    const data = await db.run_query(query, values);
    return data;
}