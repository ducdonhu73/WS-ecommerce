import { Controller, Get, Body, Put, Delete, Post, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AddCategoryRequest, CategoryResponse, UpdateCategoryRequest } from './category.dto';
import { Roles } from 'decorators/roles.decorator';
import { Role } from 'constants/roles';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.ADMIN)
  @Get('all')
  allCategory() {
    return this.categoryService.allCategory();
  }

  @Roles(Role.ADMIN)
  @Post('add')
  addCategory(@Body() request: AddCategoryRequest) {
    return this.categoryService.addCategory(request);
  }

  @Roles(Role.ADMIN)
  @Put('update/:_id')
  updateCategory(@Param('_id') id: string, @Body() request: UpdateCategoryRequest) {
    return this.categoryService.updateCategory(id, request);
  }

  @Roles(Role.ADMIN)
  @Delete('delete/:_id')
  deleteCategory(@Param('_id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Roles(Role.ADMIN)
  @Get(':_id')
  getCategoryById(@Param('_id') id: string): Promise<CategoryResponse> {
    return this.categoryService.getCategoryById(id);
  }
}
