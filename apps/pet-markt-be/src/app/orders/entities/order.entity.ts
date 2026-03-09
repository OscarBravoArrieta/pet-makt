 import { ObjectType, Field, Float, ID, registerEnumType} from '@nestjs/graphql'
 import { OrderItem } from './order-item.entity'
 import { OrderStatus } from "../../../generated/client";

 @ObjectType()
 export class Order {
     @Field(() => ID, { description: 'Id of the order' })
     id!: string

     @Field(() => [OrderItem], { description: 'Items of the order' })
     items!: OrderItem[]

     @Field(() => Float, { description: 'Total amount of the order' })
     totalAmount!: number

     @Field(() => String, { description: 'Status of the order' })
     status!: OrderStatus

     @Field(() => String, { description: 'Value to pay', nullable: true })
     paymentId!: string

     @Field(() => Date, { description: 'Order creation date' })
     createdAt!: Date

     @Field(() => Date, { description: 'Order update date' })
     updatedAt!: Date
 }

 registerEnumType(OrderStatus, {
     name: 'OrderStatus',
     description: 'Status of the order',
 })
