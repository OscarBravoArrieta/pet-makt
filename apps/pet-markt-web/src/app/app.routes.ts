 import { Route } from '@angular/router'
 import { authGuard } from './auth/auth-guard'


 export const appRoutes: Route[] = [
     {
         path: '',
         pathMatch: 'full',
         redirectTo: 'home'
     },
     {
         path: 'home',
         loadComponent: async () => {
             const mod = await import('./home/home')
             return mod.Home
         }
     },
     {
         path: 'products',
         loadComponent: async () => {
             const mod = await import('./products/products')
             return mod.Products
         }
     },
     {
         path: 'cart',
         loadComponent: async () => {
             const mod = await import('./cart/cart')
             return mod.Cart
         }
     },
     {
         path: 'checkout',
         loadComponent: async () => {
             const mod = await import('./checkout/checkout')
             return mod.Checkout
         }
     },
     {
         path: 'checkout/cancel',
         loadComponent: async () => {
             const mod = await import('./checkout/checkout-failure/checkout-failure')
             return mod.CheckoutFailure
         }
     },
     {
         path: 'checkout/success',
         loadComponent: async () => {
             const mod = await import('./checkout/checkout-success/checkout-success')
             return mod.CheckoutSuccess
         }
     },
     {
        path: 'auth/login',
         loadComponent: () => import('./auth/login/login').then((c) => c.Login)

     },
     {
         path: 'auth/signup',
         loadComponent: () => import('./auth/signup/signup').then((c) => c.Signup),
         canActivate: [authGuard]
     },
     {

         path: 'orders',
         loadComponent: () =>
         import('./orders/orders').then((c) => c.Orders)
     },
     {
         path: 'orders/:id',
         loadComponent: () =>
         import('./order/order').then((c) => c.Order)
     },


     {
         path: '**',
         redirectTo: 'home'
     },



 ]
