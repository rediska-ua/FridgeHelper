import {Component, OnInit, ViewChild, AfterViewInit, Input} from '@angular/core';
import { FormControl } from "@angular/forms";
import db from "../../../db.json";
import { Ingredient } from "../../shared-module/types/ingredient-info";
import { Category } from "../../shared-module/types/category-info";
import { AdditionalFiltersSectionComponent } from "../additional-filters-section/additional-filters-section.component";
import { RecipeService } from "../../shared-module/services/recipe.service";
import {RecipeRequest} from "../../shared-module/types/recipe-request";
import {NavigationExtras, Router} from "@angular/router";
import {ProductService} from "../../shared-module/services/product.service";
import {IngredientFullInfo} from "../../shared-module/types/ingredient-full-info";
import {environment} from "../../../environments/environment";
import {UserSettings} from "../../shared-module/types/user-settings";
import {concatAll, EMPTY, expand, forkJoin, map, mergeAll, Observable, reduce, switchMap, take} from "rxjs";
import * as http from "http";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-ingredient-selection-section',
  templateUrl: './ingredient-selection-section.component.html',
  styleUrls: ['./ingredient-selection-section.component.scss']
})

export class IngredientSelectionSectionComponent implements OnInit {

  @Input() isLoggedIn!: boolean;
  @Input() selectedIngredients!: string[];
  categories: Category[] = [];
  allFilteredCategories: Category[] = [];
  allIngredients: IngredientFullInfo[] = [];
  result = new FormControl();
  public showCountOfPost = 10;
  searchText: string = '';
  allergies: string[] = [];
  diets: string[] = [];
  cuisineTypes: string[] = [];
  mealTypes: string[] = [];
  dishTypes: string[] = [];

  selectedAllergies: string[] = [];
  selectedDiets: string[] = [];
  selectedMeals: string[] = [];
  selectedDishes: string[] = [];
  selectedCuisine: string[] = [];

  recipes: any = [];

  selectedError: boolean = false;


  constructor(
    private recipeService: RecipeService,
    private productService: ProductService,
    private router: Router,
    private http: HttpClient
  ) {
    this.allergies = productService.getAllergies();
    this.cuisineTypes = productService.getCuisineTypes();
    this.mealTypes = productService.getMeals();
    this.dishTypes = productService.getDishes();
    this.diets = productService.getDiets();

  }

  ngOnInit() {
    this.productService.allCategoriesChanged.subscribe(
      (categories) => {
        this.categories = categories;
        this.allFilteredCategories = this.categories;
      }
    );
    this.productService.allIngredientsChanged.subscribe(
      (ingredients) => (this.allIngredients = ingredients)
    );
    this.productService.changeAllIngredients();
    this.productService.changeAllCategories();
  }


  toggleSelection(ingredient: string) {
    if (this.selectedIngredients.includes(ingredient)) {
      const index = this.selectedIngredients.indexOf(ingredient);
      this.selectedIngredients.splice(index, 1);
      this.selectedIngredients = [...this.selectedIngredients];
    } else {
      if (this.selectedError) {
        this.selectedError = false;
      }
      this.selectedIngredients = [...this.selectedIngredients, ingredient];
    }
  }

  filterIngredients() {
    //this.searchText = this.searchText.toLocaleLowerCase();
    const filteredIngredients = this.allIngredients.filter(i => i.value.includes(this.searchText.toLocaleLowerCase()));
    const uniqueCategories = [...new Set(filteredIngredients.map(item => item.categoryId))];

    this.allFilteredCategories = this.categories.filter(c => uniqueCategories.includes(c.id));
  }


  findIngedientsByCategory(category: string, searchText: string) {
    return this.allIngredients.filter(x => x.categoryId === this.categories.find(c => c.value === category)?.id && x.value.includes(searchText));
  }

  groupByFn = (item: IngredientFullInfo) => item.categoryId;
  groupValueFn = (_: string, children: any[]) => ({ value: children[0].categoryId });


  findCategoryValueName(categoryId: string) {
    return this.categories.find(c => c.id === categoryId)?.value;
  }

  findCategoryById(categoryId: string) {
    return this.categories.find(c => c.id === categoryId);
  }


  removeFromSelected(ingredient: string) {
    const index = this.selectedIngredients.indexOf(ingredient);
    this.selectedIngredients.splice(index, 1);
    this.selectedIngredients = [...this.selectedIngredients];
  }

  sendRequest() {
    if (this.selectedIngredients.length === 0) {
      this.selectedError = true;
      return;
    }
    const request: RecipeRequest = {
      type: "public",
      q: this.selectedIngredients.join(","),
      app_id: environment.appId,
      app_key: environment.appKey,
      cuisineType: this.selectedCuisine,
      diet: this.selectedDiets,
      dishType: this.selectedDishes,
      health: this.selectedAllergies,
      mealType: this.selectedMeals,
    }

    console.log(request);

    /*this.recipeService.getAllRecipes(request).subscribe((data: any) => {
      console.log(data);
      this.recipes = data;
      const navigationExtras: NavigationExtras = {
        state: { recipes: this.recipes, request },
      };
      this.router.navigate(["recipe-search-result"], navigationExtras);
    });*/

    this.recipeService.getAllRecipes(request).pipe(
      expand((response) => {
        return response._links.next ? this.http.get(response._links.next.href) : EMPTY
      }),
      take(5),
      reduce((acc, current: any) => acc.concat(current.hits), [])
    ).subscribe((data) => {
      console.log(data);
      this.recipes = data;
      const navigationExtras: NavigationExtras = {
        state: { recipes: this.recipes, request },
      };
      this.router.navigate(["recipe-search-result"], navigationExtras);
    });
  }


  selectAllergies($event: string[]) {
    this.selectedAllergies = $event;
  }

  selectDiets($event: string[]) {
    this.selectedDiets = $event;
  }

  selectDishes($event: string[]) {
    this.selectedDishes = $event;
  }

  selectMeals($event: string[]) {
    this.selectedMeals = $event;
  }

  selectCuisine($event: string[]) {
    this.selectedCuisine = $event;
  }
}


