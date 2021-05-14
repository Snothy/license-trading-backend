const db = require('../helpers/database');

exports.getById = async function getById(id) {
    const query = "SELECT * FROM shelters WHERE ID = ?;";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;
}

exports.getAllShelters = async function getAllShelters() {
    const query = "SELECT * FROM shelters;";
    const data = await db.run_query(query);
    return data;
}

exports.addShelter = async function addShelter(shelter) {
    const query = "INSERT INTO shelters SET ?;";
    const data = db.run_query(query, shelter);
    return data;
}

exports.updateShelter = async function updateShelter(shelter) {
    const query = "UPDATE shelters SET ? WHERE ID = ?;";
    const values = [shelter, shelter.ID];
    const data = db.run_query(query, values);
    return data;
}

exports.removeShelter = async function removeShelter(id) {
    const query = "DELETE FROM shelters WHERE ID = ?;";
    const values = [id];
    const data = db.run_query(query, values);
    return data;
}

exports.getUsersShelters = async function getUsersShelters() {
    return null;
}

exports.assignUserShelter = async function assignUserShelter(user_id, shelter_id) {
    return null;
}

exports.removeUserShelter = async function removeUserShelter(user_id, shelter_id) {
    return null;
}