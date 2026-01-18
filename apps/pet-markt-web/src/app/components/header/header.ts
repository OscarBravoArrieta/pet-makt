import { effect, inject, signal } from '@angular/core';
import { CartStore } from './../../stores/cart.store';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

     cartStore = inject(CartStore)
     previousCount = 0
     isCartBouncing = signal(false)

     constructor() {

         effect(() => {
             const currentCount = this.cartStore.totalItems() || 0;
             if (this.previousCount < currentCount) {
                 this.isCartBouncing.set(true);
                 setTimeout(() => {
                     this.isCartBouncing.set(false);
                 }, 1000); // Duration of the bounce animation
             }
             this.previousCount = currentCount
         })
     }
 }
