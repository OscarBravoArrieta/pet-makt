 import { effect, inject, signal } from '@angular/core'
 import { CartStore } from './../../stores/cart.store'
 import { CommonModule } from '@angular/common'
 import { Component } from '@angular/core'
 import { RouterLink } from '@angular/router'
 import { AuthService } from '../../auth/auth-service'
 import { User } from '@angular/fire/auth'

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
     auth = inject(AuthService)
     currentUser$ = this.auth.currentUser$
     isDropdownOpen = false

     constructor() {

         effect(() => {
             const currentCount = this.cartStore.totalItems() || 0
             if (this.previousCount < currentCount) {
                 this.isCartBouncing.set(true)
                 setTimeout(() => {
                     this.isCartBouncing.set(false)
                 }, 1000) // Duration of the bounce animation
             }
             this.previousCount = currentCount
         })
     }

     toggleDropdown() {
         this.isDropdownOpen = !this.isDropdownOpen
     }

     getUserDisplayName(user: User | null): string {

         return user?.displayName || user?.email?.split('@')[0] || 'User'

     }

     getUserPhotoUrl(user: User | null): string {
         return(
             user?.photoURL || 'https://ui-avatars.com/api/?name=${this.getUserDisplayName(user)}&background=random&size=128'
         )

     }

     async logout() {
         try {
             await this.auth.logout()
             this.isDropdownOpen = false
         } catch (error) {
             console.error('Logout error:', error)
         }
     }
 }
