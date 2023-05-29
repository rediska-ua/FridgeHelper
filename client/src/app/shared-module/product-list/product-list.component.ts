import { Component, Input } from '@angular/core';
import {Product} from "../types/product";
import {ProductService} from "../services/product.service";
import {IngredientFullInfo} from "../types/ingredient-full-info";


type ProductInfo = {
  id: string;
  value: string;
  category: string;
  price: number;
}


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})

export class ProductListComponent {
  @Input() products: Product[] = [];

  private allIngredients: IngredientFullInfo[] = [];

  constructor(
    private productService: ProductService
  ) {
    this.productService.allIngredientsChanged.subscribe({
      next: (data) => {
        this.allIngredients = data;
      }
    });
  }

  initialCountOfProductsForShow = 5;

  isShowAllProducts = false;

  getIngredientName(id: string): string {
    let result = this.allIngredients.find(x => x.id === id);
    return result!.value;
  }

  getTotalPrice() {
    return this.products
      .map((product) => product.price)
      .reduce((sum, curr) => sum + curr);
  }
}
