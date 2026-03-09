
 import { inject } from "@angular/core"
 import { signalStore, withState, withMethods, patchState } from "@ngrx/signals"
  // eslint-disable-next-line @nx/enforce-module-boundaries
 import { Order, OrderItem, OrderStatus, Product } from '@client'
 import { Apollo, gql } from "apollo-angular"
 import { map, pipe, switchMap, tap } from "rxjs"
 import { rxMethod } from "@ngrx/signals/rxjs-interop"

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

 export type OrderItemWithProduct = OrderItem & {
     product:  Product
 }

 export type OrderWithItems = Order & {
     items: OrderItemWithProduct[]
 }
 type OderState = {
     orders: OrderWithItems[]
     orderDetail: OrderWithItems | null
     error: string | null
 }

 const initialState: OderState = {
     orders: [],
     orderDetail: null,
     error: null
 }

 export const OrderStore = signalStore(
     {
         providedIn: 'root',
     },
     withState(() => initialState),
     withMethods((store, apollo = inject(Apollo)) => ({
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
