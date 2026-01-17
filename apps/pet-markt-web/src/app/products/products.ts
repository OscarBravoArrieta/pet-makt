 import { afterNextRender, Component, inject } from '@angular/core'
 import { ProductStore } from '../stores/products.store'
 import { ProductCard } from '../components/product-card/product-card'
 import { FormsModule } from '@angular/forms'
 import { debounceTime, distinctUntilChanged, Subject } from 'rxjs'
 import untilDestroyed from '../utils/untilDestroyed'

 @Component({
     selector: 'app-products',
     imports: [ProductCard, FormsModule],
     templateUrl: './products.html',
     styleUrl: './products.scss',
 })
 export class Products {

     productStore = inject(ProductStore)
     searchTerm = ''
     searchSubject = new Subject<string>()
     untilDestroyed = untilDestroyed()

     constructor() {

         this.productStore.loadProducts()

         afterNextRender(() => {
             this.searchSubject.pipe(debounceTime(500), distinctUntilChanged(), this.untilDestroyed())
                 .subscribe((term) => {
                     console.log({term})
                     this.productStore.searchProducts(term)
                 }
             )
         })

     }
     onSearchChange(term: string) {
         this.searchSubject.next(term)
         //this.searchTerm = term.toLowerCase()
         //console.log('Search term changed:', term)
     }


}
