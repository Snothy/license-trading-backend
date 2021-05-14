const db = require('../helpers/database');

exports.getAllRoles = async function getAllRoles() {
    const query = "SELECT * FROM roles;";
    const data = await db.run_query(query);
    return data;
}

exports.getById = async function getById(role_id) {
    const query = "SELECT * FROM roles WHERE id = ?;";
    const values = [role_id];
    const data = await db.run_query(query, values);
    return data;
}

exports.createRole = async function createRole(role) {
    const query = "INSERT INTO roles SET = ?;";
    const data = await db.run_query(query, role);
    return data;
}

exports.updateRole = async function updateRole(role) {
    const query = "UPDATE roles SET ? WHERE ID = ?;";
    const values = [role, role.ID];
    const data = db.run_query(query, values);
    return data;
}

exports.removeRole = async function removeRole(role_id) {
    const query = "DELETE FROM roles WHERE ID = ?;";
    const values = [role_id];
    const data = db.run_query(query, values);
    return data;
}

/*
exports.getUsersRoles = async function getUsersRoles() {
    const query = "SELECT * FROM users_roles;";
    const data = db.run_query(query);
    return data;
}
*/
