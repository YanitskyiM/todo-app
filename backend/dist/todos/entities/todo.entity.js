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
exports.Todo = void 0;
const typeorm_1 = require("typeorm");
const todo_change_entity_1 = require("./todo-change.entity");
const todo_attachment_entity_1 = require("./todo-attachment.entity");
let Todo = class Todo {
    id;
    title;
    completed;
    createdAt;
    updatedAt;
    changes;
    attachments;
};
exports.Todo = Todo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Todo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Todo.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Todo.prototype, "completed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Todo.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Todo.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => todo_change_entity_1.TodoChange, todoChange => todoChange.todo),
    __metadata("design:type", Array)
], Todo.prototype, "changes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => todo_attachment_entity_1.TodoAttachment, attachment => attachment.todo),
    __metadata("design:type", Array)
], Todo.prototype, "attachments", void 0);
exports.Todo = Todo = __decorate([
    (0, typeorm_1.Entity)('todos')
], Todo);
//# sourceMappingURL=todo.entity.js.map