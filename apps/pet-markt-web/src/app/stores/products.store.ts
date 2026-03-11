 import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
 // eslint-disable-next-line @nx/enforce-module-boundaries
 import { Product } from '@client'
 import { Apollo, gql } from 'apollo-angular'
 import { inject } from '@angular/core'
 import { tap, map, catchError, EMPTY, switchMap, pipe } from 'rxjs'
import { rxMethod } from '@ngrx/signals/rxjs-interop'

 const GET_PRODUCTS = gql`
     query GetProducts {
         products {
             id
             name
             description
             price
             image
             stripePriceId
         }
     }
 `

 const SEARCH_PRODUCTS = gql`
     query SearchProducts($SearchTerm: String!) {
         searchProducts(term: $SearchTerm) {
         id
         name
         description
         price
         image
         stripePriceId
     }
 }
 `
 const GET_FEATURED_PRODUCTS = gql`
    query GetFeaturedProducts($featured: Boolean) {
        products {
            id
            name
            description
            image
            stripePriceId
            isFeatures
        }
}
  `

 export interface ProductState {
     products: Product[]
     featuredProducts: Product[]
     loading: boolean
     error: string | null
 }

 const initialState: ProductState = {
     products: [],
     featuredProducts: [],
     loading: false,
     error: null,
 }

 export const ProductStore = signalStore(
     {
         providedIn: 'root',
     },
     withState<ProductState>(initialState),
     withMethods((store, apollo = inject(Apollo)) => ({
         loadProducts(){
             patchState(store, { loading: true, error: null })
             apollo.watchQuery<{ products: Product[] }>({
                 query: GET_PRODUCTS
             }).valueChanges.pipe(tap({
                 next: ({data}) => patchState(store, { products: (data?.products as Product[]) || [], loading: false }),
                 error: (error) => patchState(store, { error: error.message, loading: false })
             })).subscribe()
         },
         getFeaturedProducts: rxMethod<boolean>(
             pipe(
                switchMap((featured) => apollo.query<{ products: Product[] }>({
                    query: GET_FEATURED_PRODUCTS,
                    variables: { featured }
                })),
                 tap({
                     next: ({data}) => patchState(store, { products: (data?.products as Product[]) || [], loading: false, error: null }),
                     error: (error) => patchState(store, { error: error.message, loading: false })
                 })
             )
         ),

         searchProducts(term: string){
             patchState(store, { loading: true, error: null })
             apollo.query<{ searchProducts: Product[] }>({
                 query: SEARCH_PRODUCTS,
                 variables: { SearchTerm: term }
             }).pipe(map(({data}) => patchState(store, { products: (data?.searchProducts as Product[]) || [], loading: false })
             ),
             catchError((error) => {
                 patchState(store, { error: error.message, loading: false })
                 return EMPTY
             })).subscribe()
         }
     }))
 )
