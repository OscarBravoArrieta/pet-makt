 import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { OrderStore } from '../stores/order.store'
 import { RouterLink } from '@angular/router'
 import { pipe, switchMap } from 'rxjs'
 import { rxMethod } from '@ngrx/signals/rxjs-interop'


 @Component({
     selector: 'app-orders',
     imports: [CommonModule, RouterLink ],
     templateUrl: './orders.html',
     styleUrl: './orders.scss',
 })
 export class Orders implements OnInit {

     orderStore = inject(OrderStore)
     platformId = inject(PLATFORM_ID)

      ngOnInit() {
        //  if(isPlatformBrowser(this.platformId)) {
        //      this.getOrders()
        //  }
         this.getOrders()
     }
     getOrders = rxMethod<void>(
         pipe(
             switchMap(() => this.orderStore.getUserOrders())
         )
     )
 }




