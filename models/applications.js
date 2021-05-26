const db = require('../helpers/database');



exports.getAllUser = async function getAllUser(user_ID) {
    const query = "SELECT * FROM applications WHERE user_ID = ?;";
    const data = await db.run_query(query, user_ID);
    return data;
}

exports.getAllStaff = async function getAllStaff() {
    const query = "SELECT * FROM applications;";
    const data = await db.run_query(query);
    return data;
}

exports.getById = async function getById(id) {
    //GET application/:id and images that belong to that application
    let query = "SELECT * FROM applications WHERE ID = ?;";
    const values = [id];
    const appData = await db.run_query(query, values);
    query = "SELECT * FROM images WHERE application_ID = ?";
    //console.log(appData)
    const images = await db.run_query(query, values);
    const data = {appData : appData, images : images};
    return data;
}

exports.createApplication = async function createApplication(application) {
    application.status = 1; //application status to pending
    const query = "INSERT INTO applications SET ?;";
    const data = await db.run_query(query, application); 
    return data;
}

exports.updateApplication = async function updateApplication(application) {
    const query = "UPDATE applications SET ? WHERE ID = ?;";
    const values = [application, application.ID];
    const data = await db.run_query(query, values);
    //console.log(data);
    return data;
}

exports.removeApplication = async function removeApplication(id) {
    const query = "DELETE FROM applications WHERE ID = ?;";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;
}
