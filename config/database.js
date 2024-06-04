const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables

// Database connection details
const dbConfig = {
  username: process.env.NODE_ENV === 'production' ? process.env.PROD_DB_USERNAME :
    process.env.NODE_ENV === 'test' ? process.env.TEST_DB_USERNAME :
      process.env.DEV_DB_USERNAME,
  password: process.env.NODE_ENV === 'production' ? process.env.PROD_DB_PASSWORD :
    process.env.NODE_ENV === 'test' ? process.env.TEST_DB_PASSWORD :
      process.env.DEV_DB_PASSWORD,
  database: process.env.NODE_ENV === 'production' ? process.env.PROD_DB_NAME :
    process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME :
      process.env.DEV_DB_NAME,
  host: process.env.NODE_ENV === 'production' ? process.env.PROD_DB_HOST :
    process.env.NODE_ENV === 'test' ? process.env.TEST_DB_HOST :
      process.env.DEV_DB_HOST,
  dialect: 'mysql', // Assuming the same dialect for all environments
};

// Create and check the database if it doesn't exist
(async () => {
  try {
    // Create a connection without a specific database
    const connection = await mysql.createConnection({
      username: process.env.PROD_DB_USERNAME,
      password: process.env.PROD_DB_PASSWORD,
      database: process.env.PROD_DB_NAME,
      host: process.env.PROD_DB_HOST,
    });

    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    console.log(`Database ${dbConfig.database} is ready.`);

    await connection.end(); // Close the connection
  } catch (error) {
    console.error("Error creating database:", error);
  }
})();

// Create a Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: true,
    pool: {
      max: 120,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

(async () => {
  try {
    // Synchronize the database and its tables
    await sequelize.sync({ force: false, alter: true }); // Sync schema changes without dropping tables
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();

// Export the Sequelize instance for use in other parts of your application
module.exports = sequelize;
