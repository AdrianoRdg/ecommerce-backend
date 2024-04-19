import { Injectable } from '@nestjs/common';
import { category, product } from '@prisma/client';
import { CategoryService } from 'src/category/category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateSKU } from 'src/utils/sku.utils';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  async updateSku(product: product, category: category) {
    const sku = generateSKU(
      product.name,
      product.id,
      category.name,
      category.id,
    );

    return await this.prismaService.product.update({
      where: { id: product.id },
      data: { sku },
    });
  }

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );

    const product = await this.prismaService.product.create({
      data: {
        ...createProductDto,
        sku: 'pending',
        discountPrice: 0,
      },
    });

    return this.updateSku(product, category);
  }

  async findAll() {
    return this.prismaService.product.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
