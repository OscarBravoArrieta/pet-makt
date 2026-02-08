 import { ObjectType, Field, Int, Float } from "@nestjs/graphql"
 import { Product } from "../../products/entities/product.entity"

 @ObjectType()
 export class OrderItem {
     @Field(() => String, { description: "Id del registro" })
     id!: string

     @Field(() => Int, { description: "Cantidad del producto en la orden" })
     quantity!: number

     @Field(() => Float, { description: "Precio del producto al momento de la orden" })
     price!: number

     @Field(() => Product, { description: "Producto asociado al item de la orden" })
     product!: Product

     @Field(() => String, { description: "Id del producto en la orden" })
     productId!: string

     @Field(() => String, { description: "Id de la orden" })
     orderId!: string
 }
