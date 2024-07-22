import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps:true
})
export class Product extends Document {
  @Prop({
    required: true,
  })

  productName: string;
  @Prop({
    required: true,
  })

  amount: number;
  @Prop({
    required: true,
  })
  
  description: string;
  @Prop({
    required: true,
  })
  quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
