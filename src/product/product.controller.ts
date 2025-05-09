import { Body, Controller, Post, Get, Param, Put, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
    create(@Body() body: {name: string; description: string}) {
        return this.productService.create(body);
    }

    @Get()
    findAll(@Query('name') name?: string, @Query('description') description?: string) {
      return this.productService.findAll({ name, description });
    }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { name: string; description: string }) {
    return this.productService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
