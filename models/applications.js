/**
 * Module representing all functionalities to interact with the applications table in the DB.
 * @module models/applications
 * @author Petar Drumev
 * @see routes/applications for the route that requires these methods
 */

const db = require('../helpers/database');

/**
 * Get all applications from the DB for a specific user.
 * @param {number} user_ID - The user_ID of the user in the database
 * @returns {object} - Indexable container, where each index represents an application
 */
exports.getAllUser = async function getAllUser (user_ID) {
    const query = 'SELECT * FROM applications WHERE user_ID = ?;';
    const data = await db.run_query(query, user_ID);
    return data;
};

/**
 * Get all applications from the DB (only accessible by staff/admins).
 * @returns {object} - Indexable container, where each index represents an application
 */
exports.getAllStaff = async function getAllStaff () {
    const query = 'SELECT * FROM applications;';
    const data = await db.run_query(query);
    return data;
};

/**
 * Get specific application from the DB.
 * @param {number} id - The application records unique identifier in the DB
 * @returns {object} - Object with 2 attributes
 * [1] An object representing a single application with all of its attributes
 * [2] Indexable list of objects, where each object is an iamge with all of its attributes
 */
exports.getById = async function getById (id) {
    //GET application/:id and images that belong to that application
    let query = 'SELECT * FROM applications WHERE ID = ?;';
    const values = [id];
    const appData = await db.run_query(query, values);
    query = 'SELECT * FROM images WHERE application_ID = ?';
    //console.log(appData)
    const images = await db.run_query(query, values);
    const data = { appData: appData, images: images };
    return data;
};

/**
 * Get specific application by the company name.
 * @param {number} name - The company_name of the application in the DB
 * @returns {object} - Object representing an application
 */
exports.getByName = async function getByName (name) {
    const query = 'SELECT * FROM applications WHERE company_name = ?;';
    const values = [name];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * Insert new application record into the DB.
 * @param {object} application - Object representing an application
 * @returns {object} - Information about the executed query
 */
exports.createApplication = async function createApplication (application) {
    let query;
    let dataApp = 0;
    //console.log(application.hasOwnProperty('images'));
    //nsole.log(application);
    const { images, ...applicationObj } = application;
    applicationObj.status = 1; //application status to pending
    query = 'INSERT INTO applications SET ?;';
    dataApp = await db.run_query(query, applicationObj);
    //console.log(dataApp);

    if (Object.prototype.hasOwnProperty.call(application, 'images')) { //if the client submitted images //object.prototype to avoid eslint error for prototype-builtins
        images.fileList.map(async (img) => {
            const imgPath = img.response.links.path;
            //console.log(imgPath);
            //query = 'INSERT INTO images SET ?;';
            query = 'INSERT INTO images(imageURL, application_ID) VALUES (?, ?);';
            const values = [imgPath, dataApp.insertId];

            await db.run_query(query, values);
        });
    }

    return dataApp;
};

/**
 * Update an existing application record in the DB.
 * @param {object} application - Object representing an application, not necessarily containing all attributes
 * @returns {object} - Information about the executed query
 */
exports.updateApplication = async function updateApplication (application) {
    const query = 'UPDATE applications SET ? WHERE ID = ?;';
    const values = [application, application.ID];
    const data = await db.run_query(query, values);
    //console.log(data);
    return data;
};

/**
 * Delete an existing application record from the DB.
 * @param {number} id - The application records unique identifier in the DB
 * @returns {object} - Information about the executed query
 */
exports.removeApplication = async function removeApplication (id) {
    const query = 'DELETE FROM applications WHERE ID = ?;';
    const values = [id];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * Change the status of an existing application
 * @param {object} application - Object representing an application, not necessarily containing all attributes
 * @returns {object} - Information about the executed query
 */
exports.changeStatus = async function changeStatus (application) {
    const query = 'UPDATE applications SET ? WHERE ID = ?;';
    const values = [application, application.ID];
    const data = await db.run_query(query, values);
    //console.log(data);
    return data;
};
