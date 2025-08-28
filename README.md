# Cursor App - Full Stack Project

This is a full-stack application with a React frontend and NestJS backend, featuring a complete Todo application.

## Project Structure

```
cursor-app/
├── frontend/          # React TypeScript application with Todo app
├── backend/           # NestJS TypeScript backend with Todo API
└── README.md          # This file
```

## Frontend (React + TypeScript + Tailwind + Shadcn/ui)

The frontend is a modern React application built with TypeScript, Tailwind CSS, and Shadcn/ui components.

### Features
- React 19 with TypeScript
- Tailwind CSS for styling
- Shadcn/ui component library
- TanStack Query (React Query) for state management
- Modern development setup with hot reload
- Complete Todo application with CRUD operations

### Running the Frontend

```bash
cd frontend
npm install
npm start
```

The frontend will be available at: http://localhost:3000

## Backend (NestJS + TypeScript)

The backend is a NestJS application built with TypeScript, providing a RESTful API for the Todo application.

### Features
- NestJS framework with TypeScript
- RESTful API endpoints for todos
- CORS enabled for frontend communication
- Hot reload in development mode
- In-memory data storage (can be extended with database)

### API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint
- `GET /api/status` - API status information

#### Todo Endpoints
- `GET /todos` - Get all todos
- `POST /todos` - Create a new todo
- `GET /todos/:id` - Get a specific todo
- `PATCH /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

### Running the Backend

```bash
cd backend
npm install
npm run start:dev
```

The backend will be available at: http://localhost:3001

## Todo Application Features

The frontend includes a complete Todo application with:

- ✅ Add new todos
- ✅ Mark todos as complete/incomplete
- ✅ Edit existing todos
- ✅ Delete todos
- ✅ Real-time updates with React Query
- ✅ Beautiful UI with Shadcn/ui components
- ✅ Responsive design with Tailwind CSS

## Development

### Prerequisites
- Node.js (version 18+ recommended)
- npm or yarn

### Getting Started

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd cursor-app
   ```

2. **Start the backend:**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

3. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Available Scripts

#### Frontend
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

#### Backend
- `npm run start:dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run build` - Build the application
- `npm run test` - Run tests

## API Documentation

### Health Check
```http
GET /health
```
Returns the current health status and timestamp.

### API Status
```http
GET /api/status
```
Returns API information including version and environment.

### Todo Operations

#### Get All Todos
```http
GET /todos
```

#### Create Todo
```http
POST /todos
Content-Type: application/json

{
  "title": "Buy groceries"
}
```

#### Update Todo
```http
PATCH /todos/:id
Content-Type: application/json

{
  "title": "Buy groceries and milk",
  "completed": true
}
```

#### Delete Todo
```http
DELETE /todos/:id
```

## Technologies Used

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- TanStack Query (React Query)
- Create React App

### Backend
- NestJS
- TypeScript
- Express.js
- Jest for testing

## Contributing

1. Make your changes
2. Test both frontend and backend
3. Ensure CORS is properly configured
4. Submit a pull request

## License

This project is private and unlicensed.
