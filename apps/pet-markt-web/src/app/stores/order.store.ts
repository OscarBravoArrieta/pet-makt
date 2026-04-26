
 import { inject } from "@angular/core"
 import { signalStore, withState, withMethods, patchState } from "@ngrx/signals"
  // eslint-disable-next-line @nx/enforce-module-boundaries
 import { Order, OrderItem, OrderStatus, Product } from '@client'
 import { Apollo, gql } from "apollo-angular"
 import { catchError, EMPTY, from, map, pipe, switchMap, tap } from "rxjs"
 import { rxMethod } from "@ngrx/signals/rxjs-interop"
 import { AuthService } from "../auth/auth-service"

 const GET_ORDER = gql `query GetOrder($id: String!) {
     order(id: $id) {
         id
         totalAmount
         status
         items {
             id
             quantity
             price
             product {
                 id
                 name
                 image
            }
         }
         createdAt
    }
 }`

 const UPDATE_ORDER = gql `
 mutation UpdateOrderStatus ($id: String!, $status!: OrderStatus!) {
    updateOrder(updateOrderInput:{
	    id: $id,
		status: $status
	}){
	  id
	  status
	  totalAmount
	  items {
	    id
		quantity
		price
		product {
		  id
		  name
		  image
		}
	  }
	  updatedAt
	}
 }`

 const DELETE_UNPAID_ORDER = gql`
    mutation RemoveOrder ($id: String) {
        removeUnpaid (id: $id) {
            orderId
            success
            error
        }
    }
 `

  const GET_USER_ORDERS = gql`
     query GetUserOrders ($token: String!) {
         userOrders(token: $token) {
             id
             totalAmount
             status
             items {
                 id
                 quantity
                 price
                 product {
                     id
                     name
                     image
                 }
             }
             createdAt
         }
     }
 `

 export type OrderItemWithProduct = OrderItem & {
     product:  Product
 }

 export type OrderWithItems = Order & {
     items: OrderItemWithProduct[]
 }
 type OderState = {
     loading: boolean
     orders: OrderWithItems[]
     orderDetail: OrderWithItems | null
     error: string | null
 }

 const initialState: OderState = {
     loading: false,
     orders: [],
     orderDetail: null,
     error: null
 }



 export const OrderStore = signalStore(
     {
         providedIn: 'root',
     },
     withState(() => initialState),
     withMethods((store, apollo = inject(Apollo), auth = inject(AuthService)) => ({
         getOrder(id: string) {
             patchState(store, { error: null })
             return apollo.query<{ order: OrderWithItems }>({
                 query: GET_ORDER,
                 variables: { id },
             }).pipe(
                 tap({
                     next: ({data}) => {
                         patchState(store, { orderDetail: data?.order })
                     },
                     error: (error) => {
                         patchState(store, { error: error.message })
                     }
                 }),
                 map(({data}) => data?.order)
             )
         },

         updateOrder:rxMethod<{id: string, status: OrderStatus}>(
             pipe(
                 switchMap(({id, status}) => apollo.mutate<{
                     updateOrder: OrderWithItems

                 }>({
                     mutation: UPDATE_ORDER,
                     variables: {
                        id,
                        status
                     }
                 }))
                )
         ),

         getUserOrders(){
             patchState(store, { error: null, loading: true })
             return from(auth.getToken()).pipe(
                    //  filter((user) => !!user),
                    //  take(1),
                    //  switchMap((user) => ),
                     switchMap((token) => {
                         if (!token) {
                             throw new Error('User is not authenticated')
                         }
                         console.log('oken in orderstore for getUsrOrdes:', token)
                         return apollo.query<{ userOrders: OrderWithItems[] }>({
                             query: GET_USER_ORDERS,
                             variables: {
                                 token
                             }
                         })
                     }),
                     tap((result) =>{
                         patchState(store, {
                             orders: result.data?.userOrders,
                             loading: false,
                             error: null
                     })
                 }),
                 catchError((error) => {
                     patchState(store, { loading: false, error: error.message })
                     return EMPTY
                })
            )
         },
         removeUnpaidOrder:rxMethod<string>(
             pipe(
                 switchMap((id) => apollo.mutate<{
                     updateOrder: OrderWithItems

                 }>({
                     mutation: DELETE_UNPAID_ORDER,
                     variables: {
                        id
                     }
                 })
                ),
                tap({
                     next: ({data}) => {
                         console.log('Unpaid order removed successfully', {data})
                         patchState(store, { error: null })
                    },
                     error: (error) =>patchState(store, { error: error.message })
                })
             )
         ),

         setError(error: string) {
             patchState(store, { error })
         },
     }))
 )
