import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import db from "../../../db.json";
import {environment} from "../../../environments/environment";

import { AuthService } from "../auth/auth.service";
import { BehaviorSubject } from "rxjs";
import { Ingredient } from "../types/ingredient-info";
import { Category } from "../types/category-info";
import { Product } from "../types/product";
import { IngredientFullInfo } from "../types/ingredient-full-info";
import {addUnitAlias} from "ngx-bootstrap/chronos/units/aliases";


@Injectable({ providedIn: 'root' })
export class ProductService {
  private url: string = environment.baseUrl;
  private allergies: string[] = [];
  private diets: string[] = [];
  private cuisineTypes: string[] = [];
  private mealTypes: string[] = [];
  private dishTypes: string[] = [];

  public userInventory: Product[] = [];
  private userInventorySource = new BehaviorSubject<Product[]>(this.userInventory);
  userInventoryChanged = this.userInventorySource.asObservable();

  public allIngredients: IngredientFullInfo[] = [];
  private allIngredientsSource = new BehaviorSubject<IngredientFullInfo[]>(this.allIngredients);
  allIngredientsChanged = this.allIngredientsSource.asObservable();

  public allCategories: Category[] = [];
  private allCategoriesSource = new BehaviorSubject<Category[]>(this.allCategories);
  allCategoriesChanged = this.allCategoriesSource.asObservable();

  constructor(
    private http: HttpClient,
    private AuthService: AuthService
  ) {
    db.Allergies.forEach(x => this.allergies.push(x));
    db.Diets.forEach(x => this.diets.push(x));
    db.CuisineType.forEach(x => this.cuisineTypes.push(x));
    db.MealType.forEach(x => this.mealTypes.push(x));
    db.DishType.forEach(x => this.dishTypes.push(x));

    if (AuthService.isAuthenticated()) {
      this.getAvailableProductsByUser().subscribe({
        next: (products: Product[]) => {
          console.log("id: " + this.AuthService.getUserId() + "products" + products);
          this.userInventory = products;
          this.changeUserInventory();
        },
        error: (error: Error) => {
          console.log('Error occurred while getting products: ' + error.message);
        },
      });
    }

    this.getCategories().subscribe({
      next: (data) => {
        this.allCategories = data;
        this.changeAllCategories();
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.getIngredients().subscribe({
      next: (data) => {
        const tempArray = [];
        for (let item of data) {
          tempArray.push({
            categoryId: item.categoryId,
            id: item.id,
            selected: false,
            value: item.value
          });
        }
        this.allIngredients = tempArray;
        this.changeAllIngredients();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


  changeUserInventory() {
    this.userInventorySource.next(this.userInventory);
  }

  changeAllIngredients() {
    this.allIngredientsSource.next(this.allIngredients);
  }

  changeAllCategories() {
    this.allCategoriesSource.next(this.allCategories);
  }

  getIngredients() {
    return this.http.get<Ingredient[]>(`${this.url}ProductBase/ingredients`);
  }

  getCategories() {
    return this.http.get<Category[]>(`${this.url}ProductBase/categories`);
  }

  getCategoryById(categoryId: string) {
    return this.http.get<Category>(`${this.url}/${categoryId}`)
  }

  getIngredientsByCategories() {
    return this.http.get<Product[]>(this.url);
  }

  getIngredientByName(name: string) {
    return this.http.get<Ingredient>(`${this.url}ProductBase/ingredients/name/${name}`);
  }

  getAvailableProductsByUser() {
    return this.http.get<Product[]>(`${this.url}Products/getByUser`);
  }

  createProduct(product: Product) {
    product.userId = this.AuthService.getUserId();
    return this.http.post<Product>(`${this.url}Products`, product);
  }

  updateProduct(product: Product) {
    return this.http.put<Product>(`${this.url}Products/${product.id}`, product);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.url}Products/${id}`);
  }

  getAllergies() {
    return this.allergies;
  }

  getDiets() {
    return this.diets;
  }

  getMeals() {
    return this.mealTypes;
  }

  getDishes() {
    return this.dishTypes;
  }

  getCuisineTypes() {
    return this.cuisineTypes;
  }

  getBoughtProductsByDate(date: Date) {
      return this.http.get<Product[]>(`${this.url}Products/getByUser`);
  }
}
