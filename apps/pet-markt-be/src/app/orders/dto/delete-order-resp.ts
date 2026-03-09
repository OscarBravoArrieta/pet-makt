 import { ObjectType, Field, ID } from '@nestjs/graphql'

 @ObjectType()
 export class DeleteOrderResp {
     @Field(() => Boolean, { description: 'Indicates if the order was successfully deleted' })
     success!: boolean

     @Field(() => ID, { description: 'Id of the deleted order' })
     orderId!: string

     @Field(() => String, { nullable: true, description: 'Message describing the result of the delete operation' })
     error?: string

 }
