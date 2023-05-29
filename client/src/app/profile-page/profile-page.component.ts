import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {AuthService} from "../shared-module/auth/auth.service";
import {SettingsService} from "../shared-module/services/settings.service";
import {UserInfo} from "../shared-module/types/user-info";
import {UserSettings} from "../shared-module/types/user-settings";
import {RecipeService} from "../shared-module/services/recipe.service";
import {SavedRecipe} from "../shared-module/types/saved-recipe";
import {MatDialog} from "@angular/material/dialog";
import {DeleteProductPopUpComponent} from "../modals/delete-product-pop-up/delete-product-pop-up.component";
import {DeleteConfirmPopUpComponent} from "../modals/delete-confirm-pop-up/delete-confirm-pop-up.component";
import {RecipePopUpComponent} from "../recipes-search-result-page/recipe-pop-up/recipe-pop-up.component";


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  user: UserInfo = <UserInfo> {};
  settings: UserSettings = <UserSettings> {};

  selectedAllergies: string[] = [];
  selectedDiets: string[] = [];
  selectedMeals: string[] = [];
  selectedDishes: string[] = [];
  selectedCuisine: string[] = [];

  savedRecipes: SavedRecipe[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private settingsService: SettingsService,
    private recipeService: RecipeService,
    private matDialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: (data) => {
        this.user.name = data.name;
        this.user.email = data.email;
      }
    });

    this.recipeService.savedRecipesChanged.subscribe({
      next: (recipes) => {
        console.log("here: ", recipes);
        this.savedRecipes = recipes;
      }, error: (error) => {
        console.log("Error while getting saved recipes from server" + error)
      }
    });

    this.settingsService.userSettingsChanged.subscribe(
      (settings) => {
        this.settings = settings;

        if (settings.allergyType === undefined) {
          return;
        }

        if (settings.allergyType === "") {
          this.selectedAllergies = [];
        } else {
          this.selectedAllergies = settings.allergyType.split(';');
        }

        if (settings.dietType === "") {
          this.selectedDiets = [];
        } else {
          this.selectedDiets = settings.dietType.split(';');
        }

        if (settings.mealType === "") {
          this.selectedMeals = [];
        } else {
          this.selectedMeals = settings.mealType.split(';');
        }

        if (settings.dishType === "") {
          this.selectedDishes = [];
        } else {
          this.selectedDishes = settings.dishType.split(';');
        }

        if (settings.cuisineType === "") {
          this.selectedCuisine = [];
        } else {
          this.selectedCuisine = settings.cuisineType.split(';');
        }
      }
    );
  }


  editProfile() {
    const navigationExtras: NavigationExtras = {
      state: { user: this.user, settings: this.settings},
    };
    this.router.navigate(['/edit-profile'], navigationExtras);
  }

  openFullRecipe(recipe: SavedRecipe) {
    this.recipeService.getRecipeById(recipe.recipeId).subscribe(
      (data) => {
        const info = {
          recipe: data.recipe,
          matchNumber: 1,
          matchRate: 0.5,
        }
        const body = {
          "selectedIngredients": [],
          "recipe": info,
        }
        this.matDialog.open(RecipePopUpComponent, {
          data: body,
          autoFocus: false,
          maxHeight: '90vh'
        });
      }
    );
  }

  openConfirmDelete(recipe: SavedRecipe) {
    this.matDialog.open(DeleteConfirmPopUpComponent, {
      data: recipe
    });
  }
}
