"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const todo_entity_1 = require("../todos/entities/todo.entity");
const todo_change_entity_1 = require("../todos/entities/todo-change.entity");
const todo_attachment_entity_1 = require("../todos/entities/todo-attachment.entity");
exports.databaseConfig = {
    type: process.env.DB_TYPE || 'sqlite',
    database: process.env.DB_DATABASE || 'database.sqlite',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    entities: [todo_entity_1.Todo, todo_change_entity_1.TodoChange, todo_attachment_entity_1.TodoAttachment],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    ...(process.env.DB_TYPE === 'postgres' ? {} : {}),
    ...(process.env.DB_TYPE === 'postgres' ? {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    } : {}),
};
//# sourceMappingURL=database.config.js.map