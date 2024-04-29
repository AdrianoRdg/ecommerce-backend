import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', new DefaultValuePipe(16), ParseIntPipe)
    pageSize?: number,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ) {
    return this.productService.findAll(page, pageSize, orderBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Get('category/:category')
  findByCategoryName(
    @Param('category') category: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', new DefaultValuePipe(16), ParseIntPipe)
    pageSize?: number,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ) {
    return this.productService.findByCategoryName(
      category,
      page,
      pageSize,
      orderBy,
    );
  }

  @Get('category-by-id/:id')
  findByCategoryId(
    @Param('id') id: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', new DefaultValuePipe(16), ParseIntPipe)
    pageSize?: number,
  ) {
    return this.productService.findByCategoryId(+id, page, pageSize);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
