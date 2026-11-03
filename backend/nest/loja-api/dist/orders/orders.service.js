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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const orders_entity_1 = require("./orders.entity");
const orders_item_entity_1 = require("./orders-item.entity");
const product_entity_1 = require("../products/product.entity");
let OrdersService = class OrdersService {
    ordersRepository;
    dataSource;
    constructor(ordersRepository, dataSource) {
        this.ordersRepository = ordersRepository;
        this.dataSource = dataSource;
    }
    findAll() {
        return this.ordersRepository.find({ order: { id: 'DESC' } });
    }
    findAllForUser(userId) {
        return this.ordersRepository.find({
            where: { userId },
            order: { id: 'DESC' },
        });
    }
    async findOne(id) {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(`Pedido ${id} não encontrado`);
        }
        return order;
    }
    async create(dto, userId = null) {
        return this.dataSource.transaction(async (manager) => {
            const order = manager.create(orders_entity_1.Order, {
                userId,
                status: 'OPEN',
                items: [],
            });
            for (const line of dto.items) {
                const product = await manager.findOne(product_entity_1.Product, {
                    where: { id: line.productId },
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Produto ${line.productId} não encontrado`);
                }
                if (line.quantity > product.stock) {
                    throw new common_1.BadRequestException(`estoque insuficiente para produto ${product.id} (stock=${product.stock})`);
                }
                await manager.decrement(product_entity_1.Product, { id: product.id }, 'stock', line.quantity);
                const item = manager.create(orders_item_entity_1.OrderItem, {
                    productId: product.id,
                    quantity: line.quantity,
                    unitPrice: product.price,
                });
                order.items.push(item);
            }
            return manager.save(order);
        });
    }
    async cancel(id) {
        return this.dataSource.transaction(async (manager) => {
            const order = await manager.findOne(orders_entity_1.Order, {
                where: { id },
                relations: ['items'],
            });
            if (!order) {
                throw new common_1.NotFoundException(`Pedido ${id} não encontrado`);
            }
            if (order.status === 'PAID') {
                throw new common_1.BadRequestException(`Não é possível cancelar o pedido ${id} porque o mesmo já se encontra pago (PAID).`);
            }
            if (order.status !== 'OPEN') {
                throw new common_1.BadRequestException('só pedidos OPEN podem ser cancelados');
            }
            for (const item of order.items) {
                await manager.increment(product_entity_1.Product, { id: item.productId }, 'stock', item.quantity);
            }
            order.status = 'CANCELLED';
            return manager.save(order);
        });
    }
    async pay(id) {
        return this.dataSource.transaction(async (manager) => {
            const order = await manager.findOne(orders_entity_1.Order, {
                where: { id },
            });
            if (!order) {
                throw new common_1.NotFoundException(`Pedido ${id} não encontrado.`);
            }
            if (order.status !== 'OPEN') {
                throw new common_1.BadRequestException(`Não é possível pagar o pedido ${id} porque o seu estado atual é '${order.status}'. Apenas pedidos 'OPEN' podem ser pagos.`);
            }
            order.status = 'PAID';
            return manager.save(order);
        });
    }
    async findOneForUser(id, userId) {
        const order = await this.findOne(id);
        if (order.userId !== userId) {
            throw new common_1.NotFoundException(`Pedido ${id} não encontrado`);
        }
        return order;
    }
    async cancelForUser(id, userId) {
        await this.findOneForUser(id, userId);
        return this.cancel(id);
    }
    findAllForActor(userId, role) {
        if (role === 'ADMIN' || role === 'MANAGER') {
            return this.findAll();
        }
        return this.findAllForUser(userId);
    }
    async findOneForActor(id, userId, role) {
        const order = await this.findOne(id);
        if (role !== 'ADMIN' && order.userId !== userId) {
            throw new common_1.NotFoundException(`Pedido ${id} não encontrado`);
        }
        return order;
    }
    async cancelForActor(id, userId, role) {
        await this.findOneForActor(id, userId, role);
        return this.cancel(id);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(orders_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map