import { Injectable } from '@nestjs/common';
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

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );

    try {
      let discountPrice = 0;

      if (createProductDto.discountPercent) {
        const discount =
          createProductDto.price * (createProductDto.discountPercent / 100);
        discountPrice = createProductDto.price - discount;
      }

      return await this.prismaService.$transaction(async (prisma) => {
        const product = await prisma.product.create({
          data: {
            ...createProductDto,
            sku: 'pending',
            discountPrice,
          },
        });

        const sku = generateSKU(
          product.name,
          product.id,
          category.name,
          category.id,
        );

        return await prisma.product.update({
          where: { id: product.id },
          data: { sku },
        });
      });
    } catch (e) {
      console.log(e);
    }
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
