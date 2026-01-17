 import { Component, input } from '@angular/core';
 // eslint-disable-next-line @nx/enforce-module-boundaries
 import { Product } from '@client'

 @Component({
     selector: 'app-product-card',
     imports: [],
     templateUrl: './product-card.html',
     styleUrl: './product-card.scss',
 })
 export class ProductCard {
     product = input.required<Product>();
 }
