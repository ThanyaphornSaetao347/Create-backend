import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(productData: Partial<Product>) {
    console.log('Product data received:', productData);

    const existing = await this.productRepository.findOne({
      where: { name: productData.name },
    });

    if (existing) {
      return {
        code: '2',
        message: 'บันทึกไม่สำเร็จ เพราะมีชื่อสินค้านี้แล้วในระบบ',
      };
    }

    const product = this.productRepository.create(productData);
    const result = await this.productRepository.save(product);

    return {
      code: '1',
      message: 'บันทึกสำเร็จ',
      data: result,
    };
  }

  findAll(filter: { name?: string; description?: string}) {
    const where: any ={};

    if (filter.name) {
      where.name = Like(`%${filter.name}%`)
    }

    if (filter.description) {
      where.description = Like(`%${filter.description}%`)
    }
    return this.productRepository.find({ where });
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  update(id: number, data: { name: string; description: string }) {
    return this.productRepository.update(id, data);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
