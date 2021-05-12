const db = require('../helpers/database');

exports.getById = async function getById(id) {
    const query = "SELECT * FROM dogs WHERE ID = ?;";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;
}

exports.getAll = async function getAll() {
    const query = "SELECT * FROM dogs;";
    const data = await db.run_query(query);
    return data;
}

exports.addDog = async function addDog(dog) {
    const query = "INSERT INTO dogs SET ?;";
    const data = db.run_query(query, dog);
    return data;
}

exports.updateDog = async function updateDog(dog) {
    const query = "UPDATE dogs SET ? WHERE ID = ?;";
    const values = [dog, dog.ID];
    const data = db.run_query(query, values);
    return data;
}

exports.removeDog = async function removeDog(id) {
    const query = "DELETE FROM dogs WHERE ID = ?;";
    const values = [id];
    const data = db.run_query(query, values);
    return data;
}