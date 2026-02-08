 import { InputType, Field, Float, Int } from '@nestjs/graphql';

 @InputType()
 export class OrderItemInput {

     @Field(() => String, { description: 'Product id' })
     productId!: string

     @Field(() => Int, { description: 'Quantity of the product' })
     quantity!: number

     @Field(() => Float, { description: 'Price of the product' })
     price!: number

 }

 @InputType()
 export class CreateOrderInput {

     @Field(() => [OrderItemInput], { description: 'Items of the order' })
     items!: OrderItemInput[]

     @Field(() => Float, { description: 'Total amount of the order'})
     totalAmount!: number

    //  @Field(() => String, { description: 'Token for the order'})
    //  token!: string

 }
