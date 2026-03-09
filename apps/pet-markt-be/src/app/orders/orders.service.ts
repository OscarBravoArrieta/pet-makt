 import { Injectable } from '@nestjs/common'
 import { CreateOrderInput } from './dto/create-order.input'
 import { UpdateOrderInput } from './dto/update-order.input'
 import { PrismaService } from '../prisma/prisma.service'
 import { DeleteOrderResp } from './dto/delete-order-resp'
 import { OrderStatus } from "../../generated/client"

 @Injectable()
 export class OrdersService {

     constructor(private prisma: PrismaService) {}

     create(createOrderInput: CreateOrderInput) {

         const { totalAmount, items } = createOrderInput
         return this.prisma.order.create({
             data: {
                 totalAmount,
                //  status: 'PENDING',
                 items: {
                     create: items.map((item) => ({
                         quantity: item.quantity,
                         price: item.price,
                         product: {
                             connect: { id: parseInt(item.productId) },
                         },
                     })),
                 },
             },
             include: {
                 items: {
                     include: {
                         product: true,
                     },
                 },
             },
         })
     }

     findAll() {
         return this.prisma.order.findMany({
             include: {
                 items: {
                     include: {
                         product: true,
                     },
                 },
             },
         })
     }

     findOne(id: string) {
         return this.prisma.order.findUnique({
             where: { id },
             include: {
                 items: {
                     include: {
                         product: true,
                     },
                 },
             },
         })
     }

     update(id: string, updateOrderInput: UpdateOrderInput) {
         return this.prisma.order.update({
             where: {
                 id
             },
             data: {
                 ...updateOrderInput,
             },
             include: {
                 items: {
                     include: {
                         product: true,
                     },
                 },
             },
         })
     }

     async removeUnpaid(id: string): Promise<DeleteOrderResp> {
         const order = await this.prisma.order.findUnique({
             where: { id },
         })

         if (!order) {
             return {
                 success: false,
                 orderId: id,
                 //error: 'Order not found',
             }
         }

         if(order.status !== OrderStatus.PAYMET_REQUIRED) {
             await this.prisma.order.delete({
                 where: { id },
             })
             return {
                 success: true,
                 orderId: id,
                 //error: 'Only unpaid orders can be deleted',
             }
         }

         return {
             success: false,
             orderId: id,
             error: `Order with id ${id} is not in ${OrderStatus.PAYMET_REQUIRED} status and cannot be deleted`,
         }
     }
}
