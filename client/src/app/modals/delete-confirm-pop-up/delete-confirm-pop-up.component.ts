import {Component, Inject} from '@angular/core';
import {ProductService} from "../../shared-module/services/product.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Product} from "../../shared-module/types/product";
import {RecipeService} from "../../shared-module/services/recipe.service";
import {SavedRecipe} from "../../shared-module/types/saved-recipe";

@Component({
  selector: 'app-delete-confirm-pop-up',
  templateUrl: './delete-confirm-pop-up.component.html',
  styleUrls: [
    '../delete-product-pop-up/delete-product-pop-up.component.scss',
    './delete-confirm-pop-up.component.scss'
  ]
})
export class DeleteConfirmPopUpComponent {
  deleteError?: string;

  currentRecipe: SavedRecipe;

  constructor(
    private recipeService: RecipeService,
    private dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.currentRecipe = data;
  }

  onSubmit() {
    this.recipeService.removeRecipe(this.currentRecipe.id).subscribe({
      next: () => {
        this.recipeService.getRecipesByUser().subscribe({
          next: (recipes: SavedRecipe[]) => {
            this.recipeService.savedRecipes = recipes;
            this.recipeService.changeSavedRecipes();
          },
          error: (error: Error) => {
            console.log('Error occurred while deleting product: ' + error.message);
          },
        });
        this.dialogRef.closeAll();
      }
    });
  }

}
