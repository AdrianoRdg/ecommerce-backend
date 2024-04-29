import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prismaService.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return this.prismaService.category.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.category.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    const category = await this.prismaService.category.findFirst({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.category.delete({ where: { id } });
  }
}
