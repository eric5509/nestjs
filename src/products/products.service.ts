import { Injectable, NotFoundException } from '@nestjs/common';
import { AddProductDto } from './dto/addProductDto';
import { UpdateProductDto } from './dto/updateProductDto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async fetchProducts(): Promise<Product[]> {
    return await this.productModel.find();
  }

  async fetchProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product)
      throw new NotFoundException('Sorry the product requested does not exist');
    return product;
  }

  async addProduct(addProductDTO: AddProductDto): Promise<Product | null> {
    try {
      return await this.productModel.create(addProductDTO);
    } catch (error) {
      throw new NotFoundException(
        'Something went wrong adding this product to the database',
      );
    }
  }

  async updateProduct(
    id: string,
    updateProduct: UpdateProductDto,
  ): Promise<Product> {
    try {
      const productExists = await this.productModel.findById(id);
      if (!productExists)
        throw new NotFoundException(
          `Sorry, the product with the ID ${id} does not Exist`,
        );
      await this.productModel.findOneAndUpdate({ _id: id }, updateProduct);
      return this.fetchProduct (id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new NotFoundException(
          'There was a problem updating this product.',
        );
      }
    }
  }

  async deleteProduct(id: string): Promise<Product[] | null> {
    try {
      const productExist = await this.productModel.findById(id);
      if (!productExist)
        throw new NotFoundException(`Product with the ID ${id} does not exist`);

      await this.productModel.deleteOne({ _id: id });

     return this.fetchProducts();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new NotFoundException(
          `Something went wrong deleting this product`,
        );
      }
    }
    return;
  }
}
