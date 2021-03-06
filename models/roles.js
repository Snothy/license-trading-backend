/**
 * Module representing all functionalities to interact with the roles table in the DB.
 * @module models/roles
 * @author Petar Drumev
 * @see routes/roles for the route that requires these methods
 */

const db = require('../helpers/database');

/**
 * Get all roles from the DB.
 * @returns {object} - Indexable container, where each index represents a role
 */
exports.getAllRoles = async function getAllRoles () {
    const query = 'SELECT * FROM roles;';
    //const query = "SELECT roles.* FROM roles JOIN users_roles ON (roles.ID = users_roles.role_ID) WHERE users_roles.user_ID = 1;";
    const data = await db.run_query(query);
    return data;
};

/**
 * Get specific role instance.
 * @param {number} role_id - The role records unique identifier in the DB
 * @returns {object} - Object representing a role
 */
exports.getById = async function getById (role_id) {
    const query = 'SELECT * FROM roles WHERE id = ?;';
    const values = [role_id];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * Get specific role instance by searching for its name.
 * @param {string} name - The name attribute of a role
 * @returns {object} - Object representing a role
 */
exports.getByName = async function getByName (name) {
    const query = 'SELECT * FROM roles WHERE name = ?;';
    const values = [name];
    const data = await db.run_query(query, values);
    //console.log(data);
    return data;
};

/**
 * Create new role. Insert new record into the roles table.
 * @param {object} role - Object representing a role, containing a name and the role's description as attributes.
 * @returns {object} - Information about the executed query
 */
exports.createRole = async function createRole (role) {
    const query = 'INSERT INTO roles SET ?;';
    const data = await db.run_query(query, role);
    return data;
};

/**
 * Update an existing role record in the DB.
 * @param {object} role - Object representing an role, not necessarily containing all attributes
 * @returns {object} - Information about the executed query
 */
exports.updateRole = async function updateRole (role) {
    const query = 'UPDATE roles SET ? WHERE ID = ?;';
    const values = [role, role.ID];
    const data = db.run_query(query, values);
    return data;
};

/**
 * Delete existing role. Remove existing record from the roles table in the DB.
 * @param {number} role_id - The role records unique identifier in the DB
 * @returns {object} - Information about the executed query
 */
exports.removeRole = async function removeRole (role_id) {
    const query = 'DELETE FROM roles WHERE ID = ?;';
    const values = [role_id];
    const data = db.run_query(query, values);
    return data;
};

/*
exports.getUsersRoles = async function getUsersRoles() {
    const query = "SELECT * FROM users_roles;";
    const data = db.run_query(query);
    return data;
}
*/
