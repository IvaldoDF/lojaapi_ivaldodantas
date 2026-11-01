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
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const patch_product_dto_1 = require("./dto/patch-product.dto");
const list_products_query_dto_1 = require("./dto/list-products-query.dto");
let ProductsController = class ProductsController {
    products = [];
    nextId = 1;
    findAll(query) {
        let result = this.products;
        if (query.q) {
            const searchTerm = query.q.toLowerCase();
            result = result.filter((p) => p.name.toLowerCase().includes(searchTerm));
        }
        if (query.minPrice !== undefined) {
            result = result.filter((p) => p.price >= query.minPrice);
        }
        if (query.maxPrice !== undefined) {
            result = result.filter((p) => p.price <= query.maxPrice);
        }
        return result;
    }
    findOne(id) {
        const product = this.products.find((p) => p.id === Number(id));
        if (!product) {
            throw new common_1.NotFoundException(`Produto ${id} não encontrado`);
        }
        return product;
    }
    create(dto) {
        const product = {
            id: this.nextId++,
            name: dto.name,
            price: dto.price,
            stock: dto.stock,
        };
        this.products.push(product);
        return product;
    }
    update(id, dto) {
        const product = this.findOne(id);
        product.name = dto.name;
        product.price = dto.price;
        product.stock = dto.stock;
        return product;
    }
    updatePartial(id, dto) {
        const product = this.findOne(id);
        if (dto.name !== undefined) {
            product.name = dto.name;
        }
        if (dto.price !== undefined) {
            product.price = dto.price;
        }
        if (dto.stock !== undefined) {
            product.stock = dto.stock;
        }
        return product;
    }
    remove(id) {
        const index = this.products.findIndex((p) => p.id === Number(id));
        if (index < 0) {
            throw new common_1.NotFoundException(`Produto ${id} não encontrado`);
        }
        this.products.splice(index, 1);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_products_query_dto_1.ListProductsQueryDto]),
    __metadata("design:returntype", Array)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Object)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Object)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, patch_product_dto_1.PatchProductDto]),
    __metadata("design:returntype", Object)
], ProductsController.prototype, "updatePartial", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products')
], ProductsController);
//# sourceMappingURL=products.controller.js.map