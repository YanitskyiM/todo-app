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
var AttachmentsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const todos_service_1 = require("./todos.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let AttachmentsController = AttachmentsController_1 = class AttachmentsController {
    todosService;
    logger = new common_1.Logger(AttachmentsController_1.name);
    uploadsDir = path.join(process.cwd(), 'uploads');
    constructor(todosService) {
        this.todosService = todosService;
    }
    async getAttachmentsForTodo(todoId) {
        this.logger.log(`Getting attachments for todo with ID: ${todoId}`);
        try {
            const result = await this.todosService.getAttachments(todoId);
            this.logger.log(`Found ${result.length} attachments`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error getting attachments: ${error.message}`, error.stack);
            throw error;
        }
    }
    async addAttachment(todoId, file) {
        this.logger.log(`Adding attachment to todo with ID: ${todoId}`);
        return await this.todosService.addAttachment(todoId, file);
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
};
exports.AttachmentsController = AttachmentsController;
__decorate([
    (0, common_1.Get)('todo/:todoId'),
    __param(0, (0, common_1.Param)('todoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "getAttachmentsForTodo", null);
__decorate([
    (0, common_1.Post)('todo/:todoId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('todoId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "addAttachment", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "getAttachment", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "removeAttachment", null);
exports.AttachmentsController = AttachmentsController = AttachmentsController_1 = __decorate([
    (0, common_1.Controller)('attachments'),
    __metadata("design:paramtypes", [todos_service_1.TodosService])
], AttachmentsController);
//# sourceMappingURL=attachments.controller.js.map