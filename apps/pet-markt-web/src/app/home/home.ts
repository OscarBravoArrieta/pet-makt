 import { Component, inject } from '@angular/core'
 import { RouterLink } from '@angular/router'
 import { ProductCard } from '../components/product-card/product-card'
 import { ProductStore } from '../stores/products.store'
 import { CartStore } from '../stores/cart.store'
// eslint-disable-next-line @nx/enforce-module-boundaries
 import { Product } from '@client';


 @Component({
     selector: 'app-home',
     imports: [ProductCard, RouterLink],
     templateUrl: './home.html',
     styleUrl: './home.scss',
 })
 export class Home {
     productStore = inject(ProductStore);
     cartStore = inject(CartStore)

     constructor() {
         this.productStore.getFeaturedProducts(true);
     }


     onAddToCart(product: Product) {
         this.cartStore.addToCart(product);
     }
 }
