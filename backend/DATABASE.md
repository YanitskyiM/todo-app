# Database Setup Guide

This backend supports both **SQLite** (default) and **PostgreSQL** databases.

## 🗄️ **Current Database: SQLite**

The backend is currently configured to use **SQLite** by default, which creates a `database.sqlite` file in the backend directory.

### **SQLite Features:**
- ✅ **File-based**: No server setup required
- ✅ **Automatic**: Tables are created automatically
- ✅ **TablePlus Compatible**: Can be opened directly in TablePlus
- ✅ **Development Ready**: Perfect for testing and development

### **SQLite Database File:**
- **Location**: `backend/database.sqlite`
- **Size**: Automatically grows as you add data
- **Tables**: `todos` table is created automatically

## 🔄 **Switching to PostgreSQL**

To use PostgreSQL instead of SQLite:

### **1. Install PostgreSQL**
```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Or download from: https://www.postgresql.org/download/
```

### **2. Create Database**
```sql
CREATE DATABASE todos_db;
CREATE USER todos_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE todos_db TO todos_user;
```

### **3. Set Environment Variables**
Create a `.env` file in the backend directory:
```bash
# Database Type
DB_TYPE=postgres

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=todos_user
DB_PASSWORD=your_password
DB_DATABASE=todos_db

# Environment
NODE_ENV=development
```

### **4. Restart Backend**
```bash
npm run start:dev
```

## 📊 **TablePlus Integration**

### **SQLite (Current Setup):**
1. Open TablePlus
2. Click "Connect" → "SQLite"
3. Browse to: `backend/database.sqlite`
4. Click "Connect"
5. You'll see the `todos` table with your data!

### **PostgreSQL:**
1. Open TablePlus
2. Click "Connect" → "PostgreSQL"
3. Enter connection details:
   - Host: `localhost`
   - Port: `5432`
   - User: `todos_user`
   - Password: `your_password`
   - Database: `todos_db`
4. Click "Connect"

## 🧪 **Testing the Database**

### **Current Status:**
- ✅ **Backend Running**: http://localhost:3001
- ✅ **Database Created**: `database.sqlite` file exists
- ✅ **API Working**: Todos can be created, read, updated, deleted
- ✅ **Data Persistence**: Data survives server restarts

### **Test Endpoints:**
```bash
# Health check
curl http://localhost:3001/health

# Get all todos
curl http://localhost:3001/todos

# Create a todo
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo"}'

# Get a specific todo
curl http://localhost:3001/todos/{id}

# Update a todo
curl -X PATCH http://localhost:3001/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a todo
curl -X DELETE http://localhost:3001/todos/{id}
```

## 🔧 **Database Schema**

### **Todos Table:**
```sql
CREATE TABLE todos (
  id VARCHAR PRIMARY KEY,           -- UUID
  title VARCHAR(255) NOT NULL,      -- Todo title
  completed BOOLEAN DEFAULT false,  -- Completion status
  createdAt DATETIME,               -- Creation timestamp
  updatedAt DATETIME                -- Last update timestamp
);
```

## 🚀 **Next Steps**

1. **Open TablePlus** and connect to `database.sqlite`
2. **Test the API** by creating, reading, updating, and deleting todos
3. **Switch to PostgreSQL** if you need a production database
4. **Add more tables** as your application grows

## 📝 **Environment Variables Reference**

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_TYPE` | `sqlite` | Database type: `sqlite` or `postgres` |
| `DB_DATABASE` | `database.sqlite` | Database name/file |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USERNAME` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `password` | PostgreSQL password |
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `3001` | Backend port |
