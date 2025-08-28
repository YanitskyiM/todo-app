"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const todo_entity_1 = require("./entities/todo.entity");
const todo_change_entity_1 = require("./entities/todo-change.entity");
const todo_attachment_entity_1 = require("./entities/todo-attachment.entity");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util_1 = require("util");
const unlinkAsync = (0, util_1.promisify)(fs.unlink);
const mkdirAsync = (0, util_1.promisify)(fs.mkdir);
let TodosService = class TodosService {
    todosRepository;
    todoChangesRepository;
    todoAttachmentsRepository;
    uploadsDir = path.join(process.cwd(), 'uploads');
    constructor(todosRepository, todoChangesRepository, todoAttachmentsRepository) {
        this.todosRepository = todosRepository;
        this.todoChangesRepository = todoChangesRepository;
        this.todoAttachmentsRepository = todoAttachmentsRepository;
        this.ensureUploadsDir();
    }
    async ensureUploadsDir() {
        try {
            await mkdirAsync(this.uploadsDir, { recursive: true });
        }
        catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }
    async create(createTodoDto) {
        const todo = this.todosRepository.create(createTodoDto);
        const savedTodo = await this.todosRepository.save(todo);
        await this.todoChangesRepository.save({
            todoId: savedTodo.id,
            changeType: todo_change_entity_1.ChangeType.CREATED,
            newValue: savedTodo.title,
        });
        return savedTodo;
    }
    async findAll() {
        return await this.todosRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const todo = await this.todosRepository.findOne({
            where: { id },
            relations: ['attachments'],
        });
        if (!todo) {
            throw new common_1.NotFoundException(`Todo with ID ${id} not found`);
        }
        return todo;
    }
    async update(id, updateTodoDto) {
        const todo = await this.findOne(id);
        if (updateTodoDto.title !== undefined &&
            updateTodoDto.title !== todo.title) {
            await this.todoChangesRepository.save({
                todoId: todo.id,
                changeType: todo_change_entity_1.ChangeType.TITLE_UPDATED,
                previousValue: todo.title,
                newValue: updateTodoDto.title,
            });
        }
        if (updateTodoDto.completed !== undefined &&
            updateTodoDto.completed !== todo.completed) {
            await this.todoChangesRepository.save({
                todoId: todo.id,
                changeType: todo_change_entity_1.ChangeType.STATUS_UPDATED,
                previousValue: todo.completed ? 'completed' : 'not completed',
                newValue: updateTodoDto.completed ? 'completed' : 'not completed',
            });
        }
        Object.assign(todo, updateTodoDto);
        return await this.todosRepository.save(todo);
    }
    async remove(id) {
        const todo = await this.findOne(id);
        await this.todoChangesRepository.save({
            todoId: todo.id,
            changeType: todo_change_entity_1.ChangeType.DELETED,
            previousValue: todo.title,
        });
        await this.todosRepository.remove(todo);
    }
    async getTodoChanges(todoId) {
        await this.findOne(todoId);
        return await this.todoChangesRepository.find({
            where: { todoId },
            order: { createdAt: 'DESC' },
        });
    }
    async addAttachment(todoId, file) {
        const todo = await this.findOne(todoId);
        if (!file) {
            throw new Error('Invalid file data: File is missing');
        }
        let relativePath;
        let fullPath;
        if (file.path) {
            fullPath = file.path;
            relativePath = path.relative(this.uploadsDir, fullPath);
        }
        else if (file.buffer) {
            const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
            relativePath = `${todoId}/${filename}`;
            fullPath = path.join(this.uploadsDir, relativePath);
            const todoDir = path.join(this.uploadsDir, todoId);
            await mkdirAsync(todoDir, { recursive: true });
            await fs.promises.writeFile(fullPath, file.buffer);
        }
        else {
            throw new Error('Invalid file data: Neither file path nor buffer is available');
        }
        const attachment = this.todoAttachmentsRepository.create({
            todoId,
            filename: path.basename(fullPath),
            originalFilename: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: relativePath,
        });
        const savedAttachment = await this.todoAttachmentsRepository.save(attachment);
        await this.todoChangesRepository.save({
            todoId,
            changeType: todo_change_entity_1.ChangeType.ATTACHMENT_ADDED,
            newValue: file.originalname,
        });
        return savedAttachment;
    }
    async getAttachments(todoId) {
        await this.findOne(todoId);
        return await this.todoAttachmentsRepository.find({
            where: { todoId },
            order: { createdAt: 'DESC' },
        });
    }
    async getAttachment(id) {
        const attachment = await this.todoAttachmentsRepository.findOne({
            where: { id },
        });
        if (!attachment) {
            throw new common_1.NotFoundException(`Attachment with ID ${id} not found`);
        }
        return attachment;
    }
    async removeAttachment(id) {
        const attachment = await this.getAttachment(id);
        const fullPath = path.join(this.uploadsDir, attachment.path);
        try {
            await unlinkAsync(fullPath);
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        await this.todoChangesRepository.save({
            todoId: attachment.todoId,
            changeType: todo_change_entity_1.ChangeType.ATTACHMENT_DELETED,
            previousValue: attachment.originalFilename,
        });
        await this.todoAttachmentsRepository.remove(attachment);
    }
};
exports.TodosService = TodosService;
exports.TodosService = TodosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(todo_entity_1.Todo)),
    __param(1, (0, typeorm_1.InjectRepository)(todo_change_entity_1.TodoChange)),
    __param(2, (0, typeorm_1.InjectRepository)(todo_attachment_entity_1.TodoAttachment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TodosService);
//# sourceMappingURL=todos.service.js.map