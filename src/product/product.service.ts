import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException(
        e.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(page: number = 1, pageSize: number = 16, order: string) {
    const skip = (page - 1) * pageSize;

    let orderBy: Record<string, 'asc' | 'desc'> | undefined;

    if (order === 'asc' || order === 'desc') {
      orderBy = { price: order };
    }

    const products = await this.prismaService.product.findMany({
      take: pageSize,
      skip,
      orderBy,
    });

    const totalCount = await this.prismaService.product.count();

    return {
      data: products,
      meta: {
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
        totalCount,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async findByCategoryName(
    category: string,
    page: number = 1,
    pageSize: number = 16,
    order: string,
  ) {
    const foundCategory = await this.categoryService.findByName(category);

    let orderBy: Record<string, 'asc' | 'desc'> | undefined;

    if (order === 'asc' || order === 'desc') {
      orderBy = { price: order };
    }

    const skip = (page - 1) * pageSize;

    const products = await this.prismaService.product.findMany({
      where: { categoryId: foundCategory.id },
      take: pageSize,
      skip,
      orderBy,
    });

    const totalCount = await this.prismaService.product.count({
      where: { categoryId: foundCategory.id },
    });

    return {
      data: products,
      meta: {
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
        totalCount,
      },
    };
  }

  async findByCategoryId(
    categoryId: number,
    page: number = 1,
    pageSize: number = 16,
  ) {
    const skip = (page - 1) * pageSize;

    return await this.prismaService.product.findMany({
      where: { categoryId },
      take: pageSize,
      skip,
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prismaService.product.delete({ where: { id } });
  }
}
