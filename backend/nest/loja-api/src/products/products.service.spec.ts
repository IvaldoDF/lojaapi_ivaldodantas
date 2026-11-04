import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

describe('ProductsService (unit)', () => {
  let service: ProductsService;
  let repo: jest.Mocked<Pick<Repository<Product>, 'findOne' | 'create' | 'save' | 'delete'>>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: repo },
      ],
    }).compile();
    service = moduleRef.get(ProductsService);
  });

  it('create deve salvar produto', async () => {
    const dto = { name: 'Caneca', price: 10, stock: 2 };
    repo.create.mockReturnValue(dto as Product);
    repo.save.mockResolvedValue({ id: 1, ...dto } as Product);
    await expect(service.create(dto as any)).resolves.toMatchObject({ id: 1, name: 'Caneca' });
  });

  it('findOne inexistente -> NotFoundException', async () => {
    // Garante que o mock retorna null para o findOne simular que o produto não existe
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });
});