import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ProductService} from "../../shared-module/services/product.service";
import {Product} from "../../shared-module/types/product";

@Component({
  selector: 'app-delete-product-pop-up',
  templateUrl: './delete-product-pop-up.component.html',
  styleUrls: [
    './delete-product-pop-up.component.scss',
  ],
})
export class DeleteProductPopUpComponent {
  deleteProductError?: string;
  currentProduct: Product = <Product>{};

  constructor(
    private productService: ProductService,
    private dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.currentProduct = data.product;
  }

  onSubmit() {
    this.productService.deleteProduct(this.currentProduct.id).subscribe({
      next: () => {
        this.productService.getAvailableProductsByUser().subscribe({
          next: (products: Product[]) => {
            this.productService.userInventory = products;
            this.productService.changeUserInventory();
          },
          error: (error: Error) => {
            console.log('Error occurred while deleting product: ' + error.message);
          },
        });
        this.dialogRef.closeAll();
      },
      error: (error) => {
        this.deleteProductError = error;
      },
    });
  }
}
