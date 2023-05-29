import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {IngredientFullInfo} from "../../shared-module/types/ingredient-full-info";
import {Category} from "../../shared-module/types/category-info";
import {ProductService} from "../../shared-module/services/product.service";
import {Product} from "../../shared-module/types/product";
import {Guid} from "../../shared-module/types/guid";

@Component({
  selector: 'app-edit-product-pop-up',
  templateUrl: './edit-product-pop-up.component.html',
  styleUrls: [
    './edit-product-pop-up.component.scss',
    '../login-pop-up/login-pop-up.component.scss',
  ],
})
export class EditProductPopUpComponent implements OnInit {

  @ViewChild('picker') datePicker?: MatDatepicker<Date>;
  editProductForm = <FormGroup>{};
  currentProduct: Product = <Product>{};
  minDate = new Date();
  editProductError?: string;
  selectedCategory: string = "No selected category";

  allIngredients: IngredientFullInfo[] = [];
  allCategories: Category[] = [];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.allIngredients = data.allIngredients;
    this.allCategories = data.allCategories;
    this.currentProduct = data.product;

    console.log(this.currentProduct);
  }

  ngOnInit(): void {
    this.editProductForm = this.buildFormGroup();
    this.onSelect();
    this.minDate = new Date(this.currentProduct.expirationDate);
  }

  private productIsChanged(): boolean {
    const ingredient = this.findIngredientNameById(this.currentProduct.ingredientId);
    return (
      ingredient!.value !== this.editProductForm.value.ingredient ||
      this.currentProduct.expirationDate !== this.editProductForm.value.expirationDate||
      this.currentProduct.price !== this.editProductForm.value.price
    );
  }

  findIngredientNameById(id: string) {
    return this.allIngredients.find(x => x.id === id);
  }


  buildFormGroup(): FormGroup {
    return this.fb.group({
      ingredient: [this.findIngredientNameById(this.currentProduct.ingredientId)!.value, [Validators.required, Validators.minLength(3)]],
      expirationDate: [this.currentProduct.expirationDate, Validators.required],
      price: [this.currentProduct.price, [Validators.required, Validators.min(1)]],
      category: this.findCategoryValueName(this.findIngredientNameById(this.currentProduct.ingredientId)!.categoryId)
    });
  }

  findCategoryValueName(categoryId: string | undefined) {
    return this.allCategories.find(c => c.id === categoryId)?.value;
  }

  groupByFn = (item: IngredientFullInfo) => item.categoryId;
  groupValueFn = (_: string, children: any[]) => ({ value: children[0].categoryId });

  onSubmit() {
    if (this.editProductForm && this.productIsChanged()) {
      const updatedProduct: Product = this.getUpdatedProductFromForm();
      this.productService.updateProduct(updatedProduct).subscribe({
        next: () => {
          this.productService.getAvailableProductsByUser().subscribe({
            next: (products: Product[]) => {
              this.productService.userInventory = products;
              this.productService.changeUserInventory();
            },
            error: (error: Error) => {
              console.log('Error occurred while updating product: ' + error.message);
            },
          });
          this.dialogRef.closeAll();
        },
        error: (error) => {
          this.editProductError = error;
        },
      });
    } else {
      this.dialogRef.closeAll();
    }
  }

  openDatePicker() {
    this.datePicker?.open();
  }

  onSelect() {
    const result = this.findCategoryValueName(
      this.allIngredients.find(x => x.value === this.editProductForm.value.ingredient)?.categoryId
    );

    if (result !== undefined) {
      this.selectedCategory = result;
    }

    console.log(this.selectedCategory);
  }

  private getUpdatedProductFromForm(): Product {
    const ingredient = this.allIngredients.find(x => x.value === this.editProductForm.value.ingredient);
    return {
      id: this.currentProduct.id,
      ingredientId: ingredient!.id,
      userId: this.currentProduct.userId,
      expirationDate: new Date(this.editProductForm.value.expirationDate).toISOString(),
      price: this.editProductForm.value.price,
      isAvailable: this.currentProduct.isAvailable,
      creationDate: this.currentProduct.creationDate
    };
  }
}
