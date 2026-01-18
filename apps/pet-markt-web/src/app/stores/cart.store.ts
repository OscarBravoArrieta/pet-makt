 import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
 // eslint-disable-next-line @nx/enforce-module-boundaries
 import { Product } from '@client'

 type CartItem = Product & {
     quantity: number
 }

 type CartState = {
     items: CartItem[]
    //  totalQuantity: number
    //  totalPrice: number
 }

 const initialState: CartState = {
     items: [],
    //  totalQuantity: 0,
    //  totalPrice: 0,
 }

 export const CartStore = signalStore(
     {
        providedIn: 'root',
     },
     withState(() => initialState),
     withComputed((store) => ({
         totalItems: () => store.items().reduce((acc, item) =>{ return acc + item.quantity}, 0),
         totalAmount: () => store.items().reduce((acc, item) => {return acc + (item.price * item.quantity)}, 0),
     })),
     withMethods((store) => ({
         addToCart(product: Product, quantity = 1) {
             const currentItems = store.items();
             const existingItemIndex = currentItems.findIndex(cartItem => cartItem.id === product.id)
             if (existingItemIndex > -1) {
                 const updatedItems = store.items().map((cartItem) => {
                     if (cartItem.id === product.id) {
                         return { ...cartItem, quantity: cartItem.quantity + quantity }
                     }
                     return cartItem;
                 })
                 patchState(store, { items: updatedItems })
             } else {
                 patchState(store, {
                     items: [...currentItems, { ...product, quantity }]
                 })
             }

         },
         updateQuantity(productId: number, quantity: number) {
             const updatedItems = store.items().map((item) => (
                    item.id === productId ? { ...item, quantity } : item
             ))

             patchState(store, { items: updatedItems })
         },
         removeFormCart(productId: number) {
             const updatedItems = store.items().filter((item) => item.id !== productId)
             patchState(store, { items: updatedItems })
         },
         clearCart() {
             patchState(store, { items: [] })
         }
     }))
 )
