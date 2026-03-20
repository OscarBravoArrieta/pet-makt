 import {
     ApplicationConfig,
     inject,
     provideBrowserGlobalErrorListeners,

 } from '@angular/core'
 import { provideRouter } from '@angular/router'
 import { appRoutes } from './app.routes'
 import {
     provideClientHydration,
     withEventReplay,
     withIncrementalHydration,
 } from '@angular/platform-browser'
 import { provideApollo } from 'apollo-angular'
 import { HttpLink } from 'apollo-angular/http'
 import { InMemoryCache } from '@apollo/client'
 import { provideHttpClient, withFetch } from '@angular/common/http'
 import { environment } from './environments/environment'
 import { provideFirebaseApp, initializeApp } from '@angular/fire/app'
 import { provideAuth, getAuth } from '@angular/fire/auth'
 import { provideFirestore, getFirestore } from '@angular/fire/firestore'

 console.log('Environment:', environment.firebaseConfig)

 export const appConfig: ApplicationConfig = {
     providers: [
         provideApollo(() => {
             const httpLink = inject(HttpLink)
             return {
                 link: httpLink.create({uri: `${environment.apiUrl}/api/graphql`}),
                 cache: new InMemoryCache(),
             }
         }),
         provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
         provideAuth(() => getAuth()),
         provideFirestore(() => getFirestore()),
         provideHttpClient(withFetch()),
         provideClientHydration(withEventReplay(), withIncrementalHydration()),
         provideBrowserGlobalErrorListeners(),
         provideRouter(appRoutes),
     ],
}
