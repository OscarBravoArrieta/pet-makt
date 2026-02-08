 import { Injectable } from '@nestjs/common'
 import { CreateCheckoutDto } from './dto/create-checkout.dto'
 import { OrdersService } from '../orders/orders.service'
 import { Stripe } from 'stripe'

 const stripeSecret = process.env.STRIPE_SECRET_KEY || ''

 if(!stripeSecret) {
     throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
 }

 const stripe = new Stripe(stripeSecret)

 @Injectable()
 export class CheckoutService {

     constructor(private orderService: OrdersService) {}
     async create(createCheckoutDto: CreateCheckoutDto) {
         const order = await  this.orderService.create({
             items: createCheckoutDto.items,
             totalAmount: createCheckoutDto.totalAmount,
         })

         const session = await stripe.checkout.sessions.create({
             line_items: createCheckoutDto.items.map(item => ({
                 price_data: {
                     currency: 'usd',
                     product_data: {
                         name: item.name
                     },
                     unit_amount: Math.round(item.price * 100)
                 },
                 quantity: item.quantity,
             })),
             mode: 'payment',
            //  success_url: `http://localhost:4200/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            //  cancel_url: `http://localhost:4200/checkout/cancel`,
             success_url: `${process.env.FRONTEND_URL}/checkout/success?orderId=${order.id}`,
             cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
             metadata: {
                 orderId: order.id,
             },
         })
         return {
             url: session.url,
             sessionId: session.id,
             orderId: order.id
         }
     }
}
