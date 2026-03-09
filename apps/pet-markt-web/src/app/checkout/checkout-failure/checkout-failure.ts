 import { CommonModule, isPlatformServer } from '@angular/common';
 import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
 import { ActivatedRoute, RouterLink } from '@angular/router';
 import { OrderStore } from '../../stores/order.store';

 @Component({
     selector: 'app-checkout-failure',
     imports: [CommonModule, RouterLink],
     templateUrl: './checkout-failure.html',
     styleUrl: './checkout-failure.scss',
 })
 export class CheckoutFailure implements OnInit {
     ordrStore = inject(OrderStore)
     route = inject(ActivatedRoute)
     platformId = inject(PLATFORM_ID)

     ngOnInit(): void {
         if (isPlatformServer(this.platformId)) {
             return
         }
         const orderId = this.route.snapshot.queryParamMap.get('orderId')
         if(!orderId) {
             this.ordrStore.setError('Order ID is missing in the URL')
             return
         }
         this.ordrStore.removeUnpaidOrder(orderId)
     }
 }
