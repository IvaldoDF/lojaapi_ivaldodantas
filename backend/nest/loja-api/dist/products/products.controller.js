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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const products_service_1 = require("./products.service");
const swagger_1 = require("@nestjs/swagger");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    findAll() {
        return this.productsService.findAll();
    }
    create(dto) {
        return this.productsService.create(dto);
    }
    update(id, dto) {
        return this.productsService.update(id, dto);
    }
    remove(id) {
        return this.productsService.remove(id);
    }
    async uploadImage(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('envie o campo file (jpeg/png/webp)');
        }
        await this.productsService.updateImageFilename(id, file.filename);
        return {
            productId: id,
            imageUrl: `/products/${id}/image`,
        };
    }
    async getImage(id) {
        const product = await this.productsService.findOne(id);
        if (!product.imageFilenames) {
            throw new common_1.NotFoundException('produto sem imagem');
        }
        const filename = (0, path_1.basename)(product.imageFilenames);
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', filename);
        if (!(0, fs_1.existsSync)(filePath)) {
            throw new common_1.NotFoundException('arquivo ausente no disco');
        }
        let type = 'image/jpeg';
        if (filename.endsWith('.png'))
            type = 'image/png';
        else if (filename.endsWith('.webp'))
            type = 'image/webp';
        return new common_1.StreamableFile((0, fs_1.createReadStream)(filePath), { type });
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os produtos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de produtos retornada com sucesso.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar produto (ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Produto criado com sucesso.' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Erro de validação nos dados do produto.',
        schema: {
            example: {
                statusCode: 400,
                message: ['name must be a string', 'price must be a positive number'],
                error: 'Bad Request'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado (Token ausente ou inválido).' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado (Papel insuficiente).' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar produto (ADMIN / MANAGER)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produto atualizado com sucesso.' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Erro de validação nos dados fornecidos.',
        schema: {
            example: {
                statusCode: 400,
                message: ['price must be a positive number'],
                error: 'Bad Request'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remover produto (ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Produto removido com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/image'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Fazer upload da imagem do produto (ADMIN)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imagem enviada com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Arquivo ausente ou tipo inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado.' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (_req, file, cb) => {
                const safeBase = (0, path_1.basename)(file.originalname).replace(/\s+/g, '_');
                const ext = (0, path_1.extname)(safeBase) || '.bin';
                cb(null, `${Date.now()}-${safeBase.replace(ext, '')}${ext}`);
            },
        }),
        limits: { fileSize: 2 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
            if (!ok) {
                return cb(null, false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Get)(':id/image'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter/Visualizar imagem do produto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stream da imagem retornada com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto sem imagem ou arquivo ausente no disco.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getImage", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map