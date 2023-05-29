import {Component, OnInit} from '@angular/core';
import test from "../../testResult.json";
import {RecipePopUpComponent} from "./recipe-pop-up/recipe-pop-up.component";
import {MatDialog} from "@angular/material/dialog";
import {similarity} from "../shared-module/validation/similiarity";
import {count} from "rxjs";
import {ProductService} from "../shared-module/services/product.service";
import {AuthService} from "../shared-module/auth/auth.service";
import {IngredientFullInfo} from "../shared-module/types/ingredient-full-info";

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-recipes-search-result-page',
  templateUrl: './recipes-search-result-page.component.html',
  styleUrls: ['./recipes-search-result-page.component.scss']
})

export class RecipesSearchResultPageComponent implements OnInit {

  selectedIngredients;

  requestResult: any = [];
  //from: number;
  //to: number;
  count: number;
  pageIndex: number = 0;
  pageSize: number = 12;
  //nextPageUrl: string
  recipes: any[] = [];
  sortedRecipes: any;

  allIngredients: IngredientFullInfo[] = [];

  constructor(
    private dialogRef: MatDialog,
    private productService: ProductService,
    private authService: AuthService
  ) {
    this.selectedIngredients = history.state["request"].q.split(',');
    this.requestResult = history.state["recipes"];
    console.log(this.selectedIngredients);



    //this.from = this.requestResult.from;
    //this.to = this.requestResult.to;
    this.count = 20;//this.requestResult.count;
    //this.nextPageUrl = this.requestResult._links.nextPageUrl;
    console.log(this.requestResult);
    this.requestResult.forEach((x: any) => this.recipes.push({
      recipe: x.recipe,
      matchNumber: this.checkMatchIngredients(x.recipe),
      matchRate: this.checkMatchIngredients(x.recipe) / x.recipe.ingredients.length,
    }));
    this.recipes = this.recipes.filter((r: any) => r.matchNumber > 0);
    const uniqueRecipes = [...new Set(this.recipes.map((item: any) => [item.recipe.label, item])).values()];
    console.log(uniqueRecipes);
    this.recipes.sort(this.compareRecipes);

    this.count = this.recipes.length;

    console.log(this.count);
  }

  ngOnInit(): void {
     /*if (this.authService.isAuthenticated()) {
       this.productService.allIngredientsChanged.subscribe(
         (ingredients) => (this.allIngredients = ingredients)
       );
       this.productService.changeAllIngredients();
     }*/
  }

  handlePageEvent($event: any) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
  }

  openFull(recipe: any) {
    const body = {
      "selectedIngredients": this.selectedIngredients,
      "recipe": recipe,
    }
    this.dialogRef.open(RecipePopUpComponent, {
      data: body,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  checkMatchIngredients(recipeInfo: any) {
    const ingredients: any[] = [];
    let ingredientsMatch = 0;
    recipeInfo.ingredients.forEach((x: any) => ingredients.push(x.food));

    //console.log(recipeInfo.label);

    for (let ingredient of this.selectedIngredients) {
      for (let item of ingredients) {
        //console.log("ingredient: " + item + "  " + similarity(item, ingredient))
        if (similarity(item, ingredient) > 0.6) {
          ingredientsMatch += 1;
        }
      }
    }
    return ingredientsMatch;
  }

  compareRecipes(a: any, b: any) {
    if (a.matchRate > b.matchRate) return -1;
    if (a.matchRate < b.matchRate) return 1;
    return 0;
  }

}
