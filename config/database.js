const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const dbConfig = require('./index'); // Import configuration based on NODE_ENV

// Create and check the database if it doesn't exist
(async () => {
  try {
    // Create a connection without a specific database
    const connection = await mysql.createConnection({
      // host: dbConfig.host,
      // user: dbConfig.username,
      // password: dbConfig.password,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      dialect: 'mysql',
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
    dialect: dbConfig.dialect
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
