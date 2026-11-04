import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { ProductsService } from '../products/products.service';

describe('CatalogService', () => {
  let service: CatalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: ProductsService,
          useValue: { findAll: jest.fn(), findOne: jest.fn() }, // Mock dos métodos necessários
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});