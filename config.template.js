// Export database connection information.
// Use the environment settings or given defaults.
exports.config = {
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || 0,
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
    connection_limit: 0
};
