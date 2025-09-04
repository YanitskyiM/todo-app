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
var TodosController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const todos_service_1 = require("./todos.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let TodosController = TodosController_1 = class TodosController {
    todosService;
    logger = new common_1.Logger(TodosController_1.name);
    uploadsDir = path.join(process.cwd(), 'uploads');
    constructor(todosService) {
        this.todosService = todosService;
    }
    async create(createTodoDto) {
        return await this.todosService.create(createTodoDto);
    }
    async reorderTodos(reorderDto) {
        return await this.todosService.reorderTodos(reorderDto.todoIds);
    }
    async findAll() {
        return await this.todosService.findAll();
    }
    async getAttachment(id, res) {
        this.logger.log(`Getting specific attachment with ID: ${id}`);
        try {
            const attachment = await this.todosService.getAttachment(id);
            const filePath = path.join(this.uploadsDir, attachment.path);
            if (!fs.existsSync(filePath)) {
                throw new Error('File not found');
            }
            res.set({
                'Content-Type': attachment.mimeType,
                'Content-Disposition': `inline; filename="${attachment.originalFilename}"`,
            });
            const file = fs.createReadStream(filePath);
            return new common_1.StreamableFile(file);
        }
        catch (error) {
            this.logger.error(`Error getting attachment: ${error.message}`, error.stack);
            throw error;
        }
    }
    async removeAttachment(id) {
        this.logger.log(`Removing attachment with ID: ${id}`);
        await this.todosService.removeAttachment(id);
        return { message: 'Attachment deleted successfully' };
    }
    async findOne(id) {
        return await this.todosService.findOne(id);
    }
    async testEndpoint(id) {
        this.logger.log(`Test endpoint called with ID: ${id}`);
        return { message: 'Test endpoint working', id };
    }
    async getTodoChanges(id) {
        return await this.todosService.getTodoChanges(id);
    }
    async getAttachments(id) {
        this.logger.log(`Getting attachments for todo with ID: ${id}`);
        try {
            const result = await this.todosService.getAttachments(id);
            this.logger.log(`Found ${result.length} attachments`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error getting attachments: ${error.message}`, error.stack);
            throw error;
        }
    }
    async addAttachment(id, file) {
        this.logger.log(`Adding attachment to todo with ID: ${id}`);
        return await this.todosService.addAttachment(id, file);
    }
    async update(id, updateTodoDto) {
        return await this.todosService.update(id, updateTodoDto);
    }
    async remove(id) {
        return await this.todosService.remove(id);
    }
};
exports.TodosController = TodosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('reorder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "reorderTodos", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('attachments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "getAttachment", null);
__decorate([
    (0, common_1.Delete)('attachments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "removeAttachment", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/test'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "testEndpoint", null);
__decorate([
    (0, common_1.Get)(':id/changes'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "getTodoChanges", null);
__decorate([
    (0, common_1.Get)(':id/attachments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "getAttachments", null);
__decorate([
    (0, common_1.Post)(':id/attachments'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "addAttachment", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "remove", null);
exports.TodosController = TodosController = TodosController_1 = __decorate([
    (0, common_1.Controller)('todos'),
    __metadata("design:paramtypes", [todos_service_1.TodosService])
], TodosController);
//# sourceMappingURL=todos.controller.js.map