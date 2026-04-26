 import { CommonModule } from '@angular/common'
 import { Component, inject, OnInit } from '@angular/core'
 import { OrderDetail } from '../components/order-detail/order-detail'
 import { OrderStore } from '../stores/order.store'
 import { pipe, switchMap } from 'rxjs'
 import { rxMethod } from '@ngrx/signals/rxjs-interop'
 import { ActivatedRoute } from '@angular/router'

 @Component({
     selector: 'app-order',
     imports: [CommonModule, OrderDetail],
     templateUrl: './order.html',
     styleUrl: './order.scss',
 })
 export class Order implements OnInit {

     orderStore = inject(OrderStore)
     route = inject(ActivatedRoute)


     ngOnInit(): void {
        const orderId = this.route.snapshot.paramMap.get('id')
        if (!orderId) {
             this.orderStore.setError('No order ID provided')
             return

        }
         this.orderStore.getOrder(orderId)
     }

     getOrder = rxMethod<string>(
         pipe(
             switchMap((id) => this.orderStore.getOrder(id))
         )
     )



 }
