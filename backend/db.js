const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuration from environment variables
const sslConfig = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mini_library_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslConfig
};

let pool = null;

/**
 * 1. initDB()
 * Connects to MySQL, ensures the connection pool is ready,
 * and creates the `books` table if it does not already exist.
 */
async function initDB() {
  try {
    // Attempt to create database if running locally or with root privileges
    try {
      const tempConnection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        port: dbConfig.port,
        ssl: sslConfig
      });

      await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
      await tempConnection.end();
    } catch (createDbErr) {
      // Cloud database services (e.g. Aiven, Railway) pre-create the DB and restrict CREATE DATABASE.
      // This warning can be safely ignored on managed DB hosts.
      console.log(`ℹ️ [MySQL] Skipping CREATE DATABASE check (${createDbErr.message})`);
    }

    // Create persistent connection pool
    pool = mysql.createPool(dbConfig);

    // Create books table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        borrower_name VARCHAR(255) NOT NULL,
        checkout_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);
    console.log(`✅ [MySQL] Connected successfully to DB '${dbConfig.database}' on ${dbConfig.host}:${dbConfig.port}`);
  } catch (error) {
    console.error(`❌ [MySQL Error] Database initialization failed: ${error.message}`);
    throw error;
  }
}

/**
 * 2. addBook({ title, description, borrower_name, checkout_date })
 * Inserts a new book record directly into the MySQL `books` table.
 */
async function addBook({ title, description, borrower_name, checkout_date }) {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDB() first.');
  }

  const query = `
    INSERT INTO books (title, description, borrower_name, checkout_date)
    VALUES (?, ?, ?, ?);
  `;
  
  const [result] = await pool.query(query, [title, description || '', borrower_name, checkout_date]);

  return {
    id: result.insertId,
    title,
    description: description || '',
    borrower_name,
    checkout_date
  };
}

/**
 * 3. getAllBooks()
 * Executes a SELECT query to fetch all book records from the MySQL `books` table.
 */
async function getAllBooks() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDB() first.');
  }

  const query = `SELECT id, title, description, borrower_name, checkout_date FROM books ORDER BY id DESC;`;
  const [rows] = await pool.query(query);
  return rows;
}

/**
 * 4. deleteBook(id)
 * Deletes a book record by ID from the MySQL `books` table.
 */
async function deleteBook(id) {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDB() first.');
  }

  const query = `DELETE FROM books WHERE id = ?;`;
  const [result] = await pool.query(query, [id]);
  return result.affectedRows > 0;
}

module.exports = {
  initDB,
  addBook,
  getAllBooks,
  deleteBook
};

