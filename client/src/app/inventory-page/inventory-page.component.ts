import {Component, OnInit} from '@angular/core';
import { Product}  from "../shared-module/types/product";
import {EditProductPopUpComponent} from "../modals/edit-product-pop-up/edit-product-pop-up.component";
import {MatDialog} from "@angular/material/dialog";
import {CreateProductPopUpComponent} from "../modals/create-product-pop-up/create-product-pop-up.component";
import {ProductService} from "../shared-module/services/product.service";
import {IngredientFullInfo} from "../shared-module/types/ingredient-full-info";
import {Category} from "../shared-module/types/category-info";
import {RecipePopUpComponent} from "../recipes-search-result-page/recipe-pop-up/recipe-pop-up.component";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss']
})

export class InventoryPageComponent implements OnInit {
  date = new Date();
  products: Product[] = [];

  allIngredients: IngredientFullInfo[] = [];
  allCategories: Category[] = [];

  chooseForSearchList: string[] = [];

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.productService.userInventoryChanged.subscribe(
      (data) => {
        this.products = data;
      }
    );
    this.productService.allCategoriesChanged.subscribe(
      (categories) => (this.allCategories = categories)
    );
    this.productService.allIngredientsChanged.subscribe(
      (ingredients) => (this.allIngredients = ingredients)
    );
    this.productService.changeAllIngredients();
    this.productService.changeAllCategories();
  }

  addProduct() {
    const body = {
      "allIngredients": this.allIngredients,
      "allCategories": this.allCategories,
    }
    this.dialog.open(CreateProductPopUpComponent, {
      data: body
    });
  }

  chooseForSearch(product: Product) {
    const ingredientName = this.allIngredients.find(i => i.id === product.ingredientId)!.value;
    if (!this.chooseForSearchList.includes(ingredientName)) {
      this.chooseForSearchList.push(ingredientName);
    }
  }

  removeFromList(ingredient: string) {
    const index = this.chooseForSearchList.indexOf(ingredient);
    if (index > -1) {
      this.chooseForSearchList.splice(index, 1);
    }
  }

  searchFromExistingIngredients() {
    const navigationExtras: NavigationExtras = {
      state: { existingIngredients: this.chooseForSearchList },
    };
    this.router.navigate(['/recipe-generator'], navigationExtras);
  }
}
