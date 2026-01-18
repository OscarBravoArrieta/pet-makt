 import { CommonModule } from '@angular/common'
 import { inject } from '@angular/core'
 import { Component } from '@angular/core'
 import { CartStore } from '../stores/cart.store'
 import { RouterLink } from '@angular/router'


 @Component({
     selector: 'app-cart',
     imports: [CommonModule, RouterLink],
     templateUrl: './cart.html',
     styleUrl: './cart.scss',
 })
 export class Cart {

     cartStore = inject(CartStore)

     updateQuantity(productId: number, event: Event) {

         const target = (event.target as HTMLInputElement).value
         const quantity = parseInt(target, 10)

         if (!isNaN(quantity) && quantity > 0) {
             this.cartStore.updateQuantity(productId, quantity)
         }
     }

 }
