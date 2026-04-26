 import { isPlatformServer } from '@angular/common'
import { inject, Injectable, OnDestroy, PLATFORM_ID, REQUEST } from '@angular/core'
 import {
     Auth,
     beforeAuthStateChanged,
     createUserWithEmailAndPassword,
     GoogleAuthProvider,
     onIdTokenChanged,
     signInWithEmailAndPassword,
     signInWithPopup,
     signOut,
     user } from '@angular/fire/auth'
 import { Router } from '@angular/router'
 import cookies from 'js-cookie'

 @Injectable({
     providedIn: 'root',
 })
 export class AuthService implements OnDestroy {

     auth = inject(Auth)
     router = inject(Router)
     platformId = inject(PLATFORM_ID)
     currentUser$ = user(this.auth)
     idToken: string | null = null
     cookieKey = '__pm_sesion'
     unsubscribeFromOnIdTokenChanged: (() => void) | undefined = undefined
     unsubscribeFromBeforeAuthStateChanged: (() => void) | undefined = undefined

     constructor() {

        if(isPlatformServer(this.platformId)) {
             this.setUpBrowserAuth()
        } else {
            //Set up client auth
            this.setUpBrowserAuth()
        }
     }

     setUpServerAuth() {
         const request = inject(REQUEST)
         const requestHeaders = request ?.headers
         console.log(requestHeaders)
         const cookieHeader = requestHeaders ?.get('cookie')
         let authIdToken: string | undefined
         if (cookieHeader) {

             const cookiePairs = cookieHeader.split(';')
             for (const pair of cookiePairs) {
                 const [key, value] = pair.trim().split ('=')
                 if (key === this.cookieKey) {
                     authIdToken = value
                     break
                 }
             }

             if (authIdToken) {
                 this.idToken = authIdToken
                 console.log('cookie set on the server: ', this.idToken)
                 this.handleCookie(this.idToken)
             } else {
                 this.handleCookie()
             }
         }
     }

     setUpBrowserAuth() {
         this.unsubscribeFromOnIdTokenChanged = onIdTokenChanged(this.auth, async (user) => {
             const token = await user?.getIdToken()
             console.log('Token from onIdTokenChanged: ', token)
             this.handleCookie(token)
         })

         let priorCookieValue: string | undefined //Step 1: Declare a variable to store the prior cookie value

         this.unsubscribeFromBeforeAuthStateChanged = beforeAuthStateChanged(this.auth, async (user) => {
             priorCookieValue = cookies.get(this.cookieKey) //Step 2: Store the current cookie value before the auth state changes
             const token = await user?.getIdToken()
             this.handleCookie(token) //Step 3: Restore the prior cookie value if the auth state change is canceled
         }, async () => {
            this.handleCookie(priorCookieValue) // step 4: Restore the prior cookie value if the auth state change is canceled
         })

         this.idToken = cookies.get(this.cookieKey) || null
     }
     handleCookie(token?: string) {

         if(token) {
             cookies.set(this.cookieKey, token)
             //this.idToken = token
         } else {
            cookies.remove(this.cookieKey)
            //this.idToken = null
         }

     }

     async login(email: string, password: string) {
         try {
             const result = await signInWithEmailAndPassword(this.auth, email, password)
             return result.user
         } catch (error) {
             console.error('Login error:', error)
             throw error
         }
     }

     async signup(email: string, password: string) {
         try {
             const result = await createUserWithEmailAndPassword(this.auth, email, password)
             return result.user
         } catch (error) {
             console.error('Signup error:', error)
             throw error
         }
     }

     async getToken() {

         let token: string | null = null
         const user = this.auth.currentUser
         if (user) {
             token = await user.getIdToken()
         } else if (this.idToken) {
             token = this.idToken
         }
         console.log('Token from getToken() methos: ', token)
         return token

     }

     async googleSignIn() {
         try {
             const provider = new GoogleAuthProvider()
             const result = await signInWithPopup(this.auth, provider)
             return result.user
         } catch (error) {
             console.error('Google Sign-In error:', error)
             throw error
         }
     }

     async logout() {
         try {
             await signOut(this.auth)
             this.router.navigate(['/auth/login'])
         } catch (error) {
             console.error('Logout error:', error)
             throw error
         }
     }

     ngOnDestroy(): void {

         this.unsubscribeFromOnIdTokenChanged ?.()
         this.unsubscribeFromBeforeAuthStateChanged ?.()

     }

}
