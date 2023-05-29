import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { TaskFrequenciesEnum } from 'src/app/shared-module/enums/task-frequencies.enum';
import { Guid } from 'src/app/shared-module/types/guid';
import {ProductService} from "../../shared-module/services/product.service";
import {Product} from "../../shared-module/types/product";
import {IngredientFullInfo} from "../../shared-module/types/ingredient-full-info";
import {Category} from "../../shared-module/types/category-info";

@Component({
  selector: 'app-create-product-pop-up',
  templateUrl: './create-product-pop-up.component.html',
  styleUrls: [
    './create-product-pop-up.component.scss',
    '../login-pop-up/login-pop-up.component.scss',
  ],
})
export class CreateProductPopUpComponent implements OnInit {
  @ViewChild('picker') datePicker?: MatDatepicker<Date>;
  createProductForm = <FormGroup>{};
  minDate = new Date();
  createProductError?: string;
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
  }

  ngOnInit(): void {
    this.createProductForm = this.buildFormGroup();
  }

  buildFormGroup(): FormGroup {
    return this.fb.group({
      ingredient: ['', [Validators.required, Validators.minLength(3)]],
      expirationDate: [new Date(), Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      category: ""
    });
  }

  findCategoryValueName(categoryId: string | undefined) {
    return this.allCategories.find(c => c.id === categoryId)?.value;
  }

  groupByFn = (item: IngredientFullInfo) => item.categoryId;
  groupValueFn = (_: string, children: any[]) => ({ value: children[0].categoryId });

  onSubmit() {
    if (this.createProductForm.valid) {
      const newProduct: Product = this.getProductFromForm();
      this.productService.createProduct(newProduct).subscribe({
        next: () => {
          this.productService.getAvailableProductsByUser().subscribe({
            next: (products: Product[]) => {
              this.productService.userInventory = products;
              this.productService.changeUserInventory();
            },
            error: (error: Error) => {
              console.log('Error occurred while creating product: ' + error.message);
            },
          });
          this.dialogRef.closeAll();
        },
        error: (error) => {
          this.createProductError = error;
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
      this.allIngredients.find(x => x.value === this.createProductForm.value.ingredient)?.categoryId
    );

    if (result !== undefined) {
      this.selectedCategory = result;
    }

    console.log(this.selectedCategory);
  }

  private getProductFromForm(): Product {
    const ingredient = this.allIngredients.find(x => x.value === this.createProductForm.value.ingredient);
    return {
      id: Guid.empty,
      ingredientId: ingredient!.id,
      userId: "",
      expirationDate: this.createProductForm.value.expirationDate.toISOString(),
      price: this.createProductForm.value.price,
      isAvailable: true,
      creationDate: new Date().toISOString(),
    };
  }

  private getFrequenciesEnumKeyByValue(value: string) {
    const indexOfS = Object.values(TaskFrequenciesEnum).indexOf(
      value as unknown as TaskFrequenciesEnum
    );
    const key = Object.keys(TaskFrequenciesEnum)[indexOfS];
    return key;
  }
}
