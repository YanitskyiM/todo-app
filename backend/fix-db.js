// Direct SQLite database manipulation with minimal dependencies
const sqlite3 = require('sqlite3').verbose();

// Open the database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

// Check if todo_attachments table exists
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='todo_attachments'", (err, row) => {
  if (err) {
    console.error('Error checking table:', err.message);
    closeDb();
    return;
  }

  if (!row) {
    console.log('todo_attachments table does not exist. Creating it now...');

    // Create the todo_attachments table
    db.run(`
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
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('todo_attachments table created successfully!');
      }
      closeDb();
    });
  } else {
    console.log('todo_attachments table already exists.');
    closeDb();
  }
});

// Close database connection
function closeDb() {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
}
