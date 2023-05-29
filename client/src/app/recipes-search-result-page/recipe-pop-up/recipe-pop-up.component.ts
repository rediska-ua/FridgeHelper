import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../shared-module/auth/auth.service";
import {ConnectionService} from "../../shared-module/services/connection.service";
import {RecipeService} from "../../shared-module/services/recipe.service";
import {RecipeInfo} from "../../shared-module/types/recipe-info";
import {Guid} from "../../shared-module/types/guid";
import {Product} from "../../shared-module/types/product";
import {SavedRecipe} from "../../shared-module/types/saved-recipe";
import {ProductService} from "../../shared-module/services/product.service";
import {IngredientFullInfo} from "../../shared-module/types/ingredient-full-info";
import {similarity} from "../../shared-module/validation/similiarity";

@Component({
  selector: 'app-recipe-pop-up',
  templateUrl: './recipe-pop-up.component.html',
  styleUrls: ['./recipe-pop-up.component.scss']
})
export class RecipePopUpComponent {

  public recipeInfo;
  public selectedItems;
  public caloriesToShow;
  public matchNumber;
  public recipeId: string;
  public ingredientsInInventory: string[] = [];

  public isLoggedIn = false;
  public connected = true;
  public isInFavourites = false;

  private savedRecipes: SavedRecipe[] = [];
  private allIngredients: IngredientFullInfo[] = [];
  private products: Product[] = [];

  private uniqueProductNames: string[] = [];

  constructor(
    private authService: AuthService,
    private recipeService: RecipeService,
    private connection: ConnectionService,
    private dialogRef: MatDialog,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.recipeInfo = data.recipe.recipe;
    this.selectedItems = data.selectedIngredients;
    this.matchNumber = data.recipe.matchNumber;
    this.caloriesToShow = Math.round(100 * this.recipeInfo.calories / this.recipeInfo.totalWeight);

    const recipeUri: string = this.recipeInfo.uri.toString();
    this.recipeId = recipeUri.substring(recipeUri.indexOf("_") + 1);

    this.authService.authStatus.subscribe({
        next: (result) => {
          console.log(result);
        },
        error: (error) => {
          console.log(error);
        }
      })
    this.connected = this.connection.connected;
    connection.Changes.subscribe((state) => (this.connected = state));

    this.isLoggedIn = this.authService.isAuthenticated();

    if (this.isLoggedIn) {
      this.recipeService.savedRecipesChanged.subscribe({
        next: (recipes: SavedRecipe[]) => {
          this.savedRecipes = recipes;
        },
        error: (error: Error) => {
          console.log('Error occurred while adding recipe to saved: ' + error.message);
        },
      });
    }

    if (this.isLoggedIn) {
      this.productService.allIngredientsChanged.subscribe(
        (ingredients) => {
          this.allIngredients = ingredients;
        });

      this.productService.userInventoryChanged.subscribe({
        next: (products: Product[]) => {
          this.products = products;
        },
        error: (error: Error) => {
          console.log('Error occurred while getting existing ingredients in recipe pop-up' + error.message);
        },
      });
    }
  }

  ngOnInit() {
    const recipesIds = this.savedRecipes.map(x => x.recipeId);
    if (recipesIds.includes(this.recipeId)) {
      this.isInFavourites = true;
    }

    const ingredientsInRecipe = this.recipeInfo.ingredients.map((x: any) => x.food);
    this.ingredientsInInventory.push(...this.products.map(x => this.allIngredients.find(r => r.id === x.ingredientId)!.value));
    this.uniqueProductNames = [...new Set(this.ingredientsInInventory)];
  }

  checkForPresence(name: string) {
    for (let ingredient of this.uniqueProductNames) {
      if (similarity(ingredient, name) > 0.5) return true
    }
    return false;
  }

  addToFavourites() {
    const body = <RecipeInfo> {};
    body.id = Guid.empty;
    body.recipeId = this.recipeId;
    body.userId = this.authService.getUserId();
    body.recipeUrl = this.recipeInfo.url;
    body.recipeTitle = this.recipeInfo.label;

    this.recipeService.addRecipeToFavourites(body).subscribe({
      next: (data) => {
        this.recipeService.getRecipesByUser().subscribe({
          next: (recipes: SavedRecipe[]) => {
            this.recipeService.savedRecipes = recipes;
            this.recipeService.changeSavedRecipes();
            this.isInFavourites = true;
          },
          error: (error: Error) => {
            console.log('Error occurred while adding recipe to saved: ' + error.message);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  removeFromFavourites() {
    const recipeId = this.savedRecipes.find(r => r.recipeId === this.recipeId)!.id;
    this.recipeService.removeRecipe(recipeId).subscribe({
      next: () => {
        this.recipeService.getRecipesByUser().subscribe({
          next: (recipes: SavedRecipe[]) => {
            this.recipeService.savedRecipes = recipes;
            this.recipeService.changeSavedRecipes();
            this.isInFavourites = false;
          },
          error: (error: Error) => {
            console.log('Error occurred while removing recipe from favourites: ' + error.message);
          },
        });
      }
    });
  }
}
