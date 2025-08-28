// Simple script to manually create the todo_attachments table (CommonJS version)
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function initDb() {
  console.log('Initializing database...');

  // Open the SQLite database
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  console.log('Checking if todo_attachments table exists...');

  // Check if the table exists
  const tableExists = await db.get(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='todo_attachments'
  `);

  if (!tableExists) {
    console.log('Creating todo_attachments table...');

    // Create the table
    await db.exec(`
      CREATE TABLE todo_attachments (
        id TEXT PRIMARY KEY,
        todoId TEXT NOT NULL,
        filename TEXT NOT NULL,
        originalFilename TEXT NOT NULL,
        mimeType TEXT NOT NULL,
        size INTEGER NOT NULL,
        path TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (todoId) REFERENCES todos(id) ON DELETE CASCADE
      )
    `);

    console.log('todo_attachments table created successfully');
  } else {
    console.log('todo_attachments table already exists');
  }

  await db.close();
  console.log('Database initialization completed');
}

initDb().catch(error => {
  console.error('Database initialization failed:', error);
});
