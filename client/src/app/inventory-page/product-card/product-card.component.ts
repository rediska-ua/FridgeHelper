import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Product } from "../../shared-module/types/product";
import {MatDialog} from "@angular/material/dialog";
import {CreateProductPopUpComponent} from "../../modals/create-product-pop-up/create-product-pop-up.component";
import {EditProductPopUpComponent} from "../../modals/edit-product-pop-up/edit-product-pop-up.component";
import {DeleteProductPopUpComponent} from "../../modals/delete-product-pop-up/delete-product-pop-up.component";
import {IngredientFullInfo} from "../../shared-module/types/ingredient-full-info";
import {Category} from "../../shared-module/types/category-info";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() allIngredients!: IngredientFullInfo[];
  @Input() allCategories!: Category[];

  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();

  constructor(
    private dialog: MatDialog
  ) {
  }

  findIngredientName(ingredientId: string) {
    return this.allIngredients.find(x => x.id === ingredientId)?.value;
  }

  findCategoryName(ingredientId: string) {
    const categoryId = this.allIngredients.find(x => x.id === ingredientId)?.categoryId;
    return this.allCategories.find(c => c.id === categoryId)?.value;
}

  editProduct() {
    const body = {
      "allIngredients": this.allIngredients,
      "allCategories": this.allCategories,
      "product": this.product
    }
    this.dialog.open(EditProductPopUpComponent, {
      data: body
    });
    this.edit.emit(this.product);
  }

  deleteProduct() {
    const body = {
      "product": this.product
    }
    this.dialog.open(DeleteProductPopUpComponent, {
      data: body
    });
    this.delete.emit(this.product);
  }

  checkExpirationDate(date: string): string {
    const dateParsed = new Date(Date.parse(date));
    const currentDate = new Date();

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(dateParsed.getFullYear(), dateParsed.getMonth(), dateParsed.getDate());
    const utc2 = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    const days = Math.floor((utc1 - utc2) / _MS_PER_DAY);

    if (days <= 3) {
      return "p-hazard";
    }
    if (days > 3 && days < 7) {
      return "p-warning";
    }
    return "p-success";
  }

}
