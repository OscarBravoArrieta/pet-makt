 import { Route } from '@angular/router';

 export const appRoutes: Route[] = [
     {
         path: '',
         pathMatch: 'full',
         loadComponent: async () => {
             const mod = await import('./home/home');
             return mod.Home
         }
     },
     {
         path: 'products',
         loadComponent: async () => {
             const mod = await import('./products/products');
             return mod.Products
         }
     },
     {
         path: 'cart',
         loadComponent: async () => {
             const mod = await import('./cart/cart');
             return mod.Cart
         }
     }

 ]
