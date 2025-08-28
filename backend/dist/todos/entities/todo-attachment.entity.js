"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoAttachment = void 0;
const typeorm_1 = require("typeorm");
const todo_entity_1 = require("./todo.entity");
let TodoAttachment = class TodoAttachment {
    id;
    todoId;
    todo;
    filename;
    originalFilename;
    mimeType;
    size;
    path;
    createdAt;
};
exports.TodoAttachment = TodoAttachment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TodoAttachment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TodoAttachment.prototype, "todoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => todo_entity_1.Todo, todo => todo.attachments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'todoId' }),
    __metadata("design:type", todo_entity_1.Todo)
], TodoAttachment.prototype, "todo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], TodoAttachment.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], TodoAttachment.prototype, "originalFilename", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], TodoAttachment.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], TodoAttachment.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], TodoAttachment.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TodoAttachment.prototype, "createdAt", void 0);
exports.TodoAttachment = TodoAttachment = __decorate([
    (0, typeorm_1.Entity)('todo_attachments')
], TodoAttachment);
//# sourceMappingURL=todo-attachment.entity.js.map