 import { afterNextRender, Component, OnInit } from '@angular/core'
 import { inject } from '@angular/core'
 import { OrderStore } from '../../stores/order.store'
 import { ActivatedRoute } from '@angular/router'
 import { CommonModule } from '@angular/common'
 import { OrderDetail } from '../../orders/components/order-detail/order-detail'
 import { CartStore } from '../../stores/cart.store'

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
         this.orderStore.getOrder(orderId).subscribe()
     }
 }
