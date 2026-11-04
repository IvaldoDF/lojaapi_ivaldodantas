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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let CategoriesController = class CategoriesController {
    categoriesService;
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    findAll() {
        return this.categoriesService.findAll();
    }
    findOne(id) {
        return this.categoriesService.findOne(id);
    }
    create(dto) {
        return this.categoriesService.create(dto);
    }
    update(id, updateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }
    remove(id) {
        return this.categoriesService.remove(id);
    }
    findProductsByCategory(id) {
        return this.categoriesService.findProductsByCategory(id);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as categorias' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de categorias retornada com sucesso.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar uma categoria pelo ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoria encontrada com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoria não encontrada.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar uma nova categoria (ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Categoria criada com sucesso.' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Erro de validação nos dados enviados.',
        schema: {
            example: {
                statusCode: 400,
                message: ['name must be a string', 'name should not be empty'],
                error: 'Bad Request'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado (Token ausente ou inválido).' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado (Papel insuficiente).' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar uma categoria existente (ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoria atualizada com sucesso.' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Erro de validação nos dados enviados.',
        schema: {
            example: {
                statusCode: 400,
                message: ['name must be a string'],
                error: 'Bad Request'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoria não encontrada.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remover uma categoria (ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoria removida com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoria não encontrada.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/products'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os produtos de uma categoria específica' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produtos da categoria retornados com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoria não encontrada.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findProductsByCategory", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('categories'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map