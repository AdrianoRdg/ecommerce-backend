import { Module } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService, CategoryService],
})
export class ProductModule {}
