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
exports.TodoChange = exports.ChangeType = void 0;
const typeorm_1 = require("typeorm");
const todo_entity_1 = require("./todo.entity");
var ChangeType;
(function (ChangeType) {
    ChangeType["CREATED"] = "created";
    ChangeType["TITLE_UPDATED"] = "title_updated";
    ChangeType["STATUS_UPDATED"] = "status_updated";
    ChangeType["DELETED"] = "deleted";
    ChangeType["ATTACHMENT_ADDED"] = "attachment_added";
    ChangeType["ATTACHMENT_DELETED"] = "attachment_deleted";
})(ChangeType || (exports.ChangeType = ChangeType = {}));
let TodoChange = class TodoChange {
    id;
    todoId;
    todo;
    changeType;
    previousValue;
    newValue;
    createdAt;
};
exports.TodoChange = TodoChange;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TodoChange.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TodoChange.prototype, "todoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => todo_entity_1.Todo, todo => todo.changes, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'todoId' }),
    __metadata("design:type", todo_entity_1.Todo)
], TodoChange.prototype, "todo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
    }),
    __metadata("design:type", String)
], TodoChange.prototype, "changeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], TodoChange.prototype, "previousValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], TodoChange.prototype, "newValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TodoChange.prototype, "createdAt", void 0);
exports.TodoChange = TodoChange = __decorate([
    (0, typeorm_1.Entity)('todo_changes')
], TodoChange);
//# sourceMappingURL=todo-change.entity.js.map