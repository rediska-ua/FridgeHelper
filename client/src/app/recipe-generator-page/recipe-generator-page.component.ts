import { Component } from '@angular/core';
import {AuthInterceptor} from "../shared-module/auth/auth.interceptor";
import {AuthService} from "../shared-module/auth/auth.service";
import {UserSettings} from "../shared-module/types/user-settings";
import {SettingsService} from "../shared-module/services/settings.service";

@Component({
  selector: 'app-recipe-generator-page',
  templateUrl: './recipe-generator-page.component.html',
  styleUrls: ['./recipe-generator-page.component.scss']
})
export class RecipeGeneratorPageComponent {

  isLoggedIn: boolean = false;
  existingIngredientsForSearch: string[] = [];

  constructor(
    private AuthService: AuthService,
    private settingsService: SettingsService
  ) {
    this.isLoggedIn = this.AuthService.isAuthenticated();
    if (this.isLoggedIn) {
      const ingredientsFromInventory = history.state["existingIngredients"];
      if (ingredientsFromInventory) {
        this.existingIngredientsForSearch = ingredientsFromInventory;
      }
      console.log(this.existingIngredientsForSearch);
    }
  }

}
