 import { afterNextRender, Component, OnInit } from '@angular/core'
 import { inject } from '@angular/core'
 import { OrderStore } from '../../stores/order.store'
 import { ActivatedRoute } from '@angular/router'
 import { CommonModule } from '@angular/common'
 import { OrderDetail } from '../../orders/components/order-detail/order-detail'
 import { CartStore } from '../../stores/cart.store'
 import { rxMethod } from '@ngrx/signals/rxjs-interop'
 import { map, pipe, switchMap } from 'rxjs'
 // eslint-disable-next-line @nx/enforce-module-boundaries
 import { OrderStatus } from '@client'

 @Component({
     selector: 'app-checkout-success',
     imports: [CommonModule, OrderDetail],
     templateUrl: './checkout-success.html',
     styleUrl: './checkout-success.scss',
 })
 export class CheckoutSuccess implements OnInit {
     orderStore = inject(OrderStore)
     route = inject(ActivatedRoute)
     cartStore = inject(CartStore)
     getAndUpdateOrder = rxMethod<string>(
         pipe(
             switchMap((orderId: string) => {
                 return this.orderStore.getOrder(orderId)
             }),
             map((order)=> {
                if (order?.status === OrderStatus.STARTED_DELIVERY) {
                    return this.orderStore.updateOrder({
                            id: order?.id.toString() || '',
                            status: OrderStatus.STARTED_DELIVERY
                    })
                }
                return null

             })
         )
     )

     constructor() {
         afterNextRender(() => {
             this.cartStore.clearCart()
         })
     }

     ngOnInit() {
         const orderId = this.route.snapshot.queryParamMap.get('orderId')
         if (!orderId) {
             this.orderStore.setError('Order ID is missing in the URL')
             return
         }
         //this.orderStore.getOrder(orderId).subscribe()
         this.getAndUpdateOrder(orderId)
     }
 }
