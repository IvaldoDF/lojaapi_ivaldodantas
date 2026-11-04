import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { existsSync, unlinkSync } from 'fs'; 
import { join, basename } from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return product;
  }

  create(dto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(dto);
    return this.productsRepository.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
  }
  
  async updateCategory(productId: number, categoryId: number) {
    const product = await this.findOne(productId);
    product.category_id = categoryId;
    return await this.productsRepository.save(product);
  }
  
  async updateImageFilename(id: number, filename: string) {
    const product = await this.findOne(id);
    product.imageFilenames = filename;
    return this.productsRepository.save(product);
  }

  async removeImage(id: number) {
  const product = await this.findOne(id);
  if (product.imageFilenames) {
    const filePath = join(process.cwd(), 'uploads', basename(product.imageFilenames));
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
    product.imageFilenames = null; 
    await this.productsRepository.save(product);
  }
  return product;
}
}