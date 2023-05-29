import { Inject, Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, catchError, concatAll, map, Observable, Subject, takeUntil, tap, throwError} from 'rxjs';
import jwt_decode from 'jwt-decode';
import { DOCUMENT } from '@angular/common';
import {RecipeRequest} from "../types/recipe-request";
import {environment} from "../../../environments/environment";
import {RecipeInfo} from "../types/recipe-info";
import {SavedRecipe} from "../types/saved-recipe";
import {Product} from "../types/product";
import {AuthService} from "../auth/auth.service";
import * as http from "http";


@Injectable({
  providedIn: 'root',
})
export class RecipeService {

  private url: string = "https://api.edamam.com/api/recipes/v2";

  public savedRecipes: SavedRecipe[] = [];
  private savedRecipesSource = new BehaviorSubject<SavedRecipe[]>(this.savedRecipes);
  savedRecipesChanged = this.savedRecipesSource.asObservable();

  constructor(
    private http: HttpClient,
    private AuthService: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {
    console.log("initial of recipe service");
    console.log("Authenticated: " + AuthService.isAuthenticated());
    if (AuthService.isAuthenticated()) {
      this.getRecipesByUser().subscribe({
        next: (recipes: SavedRecipe[]) => {
          console.log(recipes)
          this.savedRecipes = recipes;
          this.changeSavedRecipes();
        },
        error: (error: Error) => {
          console.log('Error occurred while getting recipes: ' + error.message);
        },
      });
    }
    /*this.AuthService.authStatus.subscribe({
      next: (value) => {
        if (value === true && isAuthenticated) {
          console.log("Authenticated: " + AuthService.isAuthenticated());
          this.getRecipesByUser().subscribe({
            next: (recipes: SavedRecipe[]) => {
              this.savedRecipes = recipes;
              this.changeSavedRecipes();
            },
            error: (error: Error) => {
              console.log('Error occurred while getting recipes: ' + error.message);
            },
          });
        }
      }
    });*/
  }

  getAllRecipes(body: RecipeRequest): Observable<any> {

    let dietString = "";
    let healthString = "";
    let cuisineString = "";
    let mealString = "";
    let dishString = "";

    let requestUrl = this.url + "?type=" + body.type + "&q=" + body.q + "&app_id=" + body.app_id + "&app_key=" + body.app_key;

    if (body.diet.length > 0) {
      const loweredDiet = body.diet.map(x => x.toLocaleLowerCase());
      dietString = "&diet=" + loweredDiet.join("&diet=");
    }

    if (body.health.length > 0) {
      const loweredHealth = body.health.map(x => x.toLocaleLowerCase());
      healthString = "&health=" + loweredHealth.join("&health=");
    }

    if (body.cuisineType.length > 0) {
      const loweredCuisine = body.cuisineType.map(x => x.toLocaleLowerCase());
      cuisineString = "&cuisineType=" + loweredCuisine.join("&cuisineType=");
    }

    if (body.mealType.length > 0) {
      const loweredMealType = body.mealType.map(x => x.toLocaleLowerCase());
      mealString = "&mealType=" + loweredMealType.join("&mealType=");
    }

    if (body.dishType.length > 0) {
      const loweredDishes = body.dishType.map(x => x.toLocaleLowerCase());
      dishString = "&dishType=" + loweredDishes.join("&dishType=");
    }

    requestUrl = requestUrl + dietString + healthString + cuisineString + mealString + dishString;

    return this.http.get<any>(requestUrl);
  }


  getRecipeById(id: string) {
    let requestUrl = this.url + "/recipe_" + id + "?type=public" + "&app_id=" + environment.appId + "&app_key=" + environment.appKey;
    return this.http.get<any>(requestUrl);
  }

  addRecipeToFavourites(body: RecipeInfo) {
    const url = environment.baseUrl + 'recipe';
    return this.http.post<RecipeInfo>(url, body);
  }

  getRecipesByUser() {
    const url = environment.baseUrl + 'Recipe/getSavedRecipes';
    return this.http.get<SavedRecipe[]>(url);
  }

  removeRecipe(recipeId: string) {
    const url = environment.baseUrl + `recipe/${recipeId}`;
    return this.http.delete<RecipeInfo>(url);
  }

  changeSavedRecipes() {
    this.savedRecipesSource.next(this.savedRecipes);
  }
}
