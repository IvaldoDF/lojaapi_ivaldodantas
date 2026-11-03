import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './orders.entity';
import { OrderItem } from './orders-item.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ order: { id: 'DESC' } });
  }

  // No cap. 6 (JWT): use findAllForUser(userId) em vez de listar tudo

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Pedido ${id} não encontrado`);
    }
    return order;
  }

  async create(dto: CreateOrderDto, userId: number | null = null): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const order = manager.create(Order, {
        userId,
        status: 'OPEN',
        items: [],
      });

      for (const line of dto.items) {
        // Sempre leia/grave estoque pelo manager da transação (evita entidade detached).
        const product = await manager.findOne(Product, {
          where: { id: line.productId },
        });
        if (!product) {
          throw new NotFoundException(`Produto ${line.productId} não encontrado`);
        }
        if (line.quantity > product.stock) {
          throw new BadRequestException(
            `estoque insuficiente para produto ${product.id} (stock=${product.stock})`,
          );
        }

        await manager.decrement(
          Product,
          { id: product.id },
          'stock',
          line.quantity,
        );

        const item = manager.create(OrderItem, {
          productId: product.id,
          quantity: line.quantity,
          unitPrice: product.price,
        });
        order.items.push(item);
      }

      return manager.save(order);
    });
  }

  async cancel(id: number): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id },
        relations: ['items'],
      });
      if (!order) {
        throw new NotFoundException(`Pedido ${id} não encontrado`);
      }

      if (order.status === 'PAID') {
        throw new BadRequestException(
          `Não é possível cancelar o pedido ${id} porque o mesmo já se encontra pago (PAID).`,
        );
      }
      
      if (order.status !== 'OPEN') {
        throw new BadRequestException('só pedidos OPEN podem ser cancelados');
      }

      for (const item of order.items) {
        await manager.increment(
          Product,
          { id: item.productId },
          'stock',
          item.quantity,
        );
      }

      order.status = 'CANCELLED';
      return manager.save(order);
    });
  }

  async pay(id: number): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id },
      });
      if (!order) {
        throw new NotFoundException(`Pedido ${id} não encontrado.`);
      }
      if (order.status !== 'OPEN') {
        throw new BadRequestException(
          `Não é possível pagar o pedido ${id} porque o seu estado atual é '${order.status}'. Apenas pedidos 'OPEN' podem ser pagos.`,
        );
      }

      order.status = 'PAID';
      return manager.save(order);
    });
  }

}