import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserInfo} from "../shared-module/types/user-info";
import {UserSettings} from "../shared-module/types/user-settings";
import {ProductService} from "../shared-module/services/product.service";
import {Product} from "../shared-module/types/product";
import {Guid} from "../shared-module/types/guid";
import {AuthService} from "../shared-module/auth/auth.service";
import {SettingsService} from "../shared-module/services/settings.service";

@Component({
  selector: 'app-profile-edit-page',
  templateUrl: './profile-edit-page.component.html',
  styleUrls: ['./profile-edit-page.component.scss']
})
export class ProfileEditPageComponent implements OnInit {

  userInfo: UserInfo;
  settings: UserSettings;

  selectedAllergies: string[] = [];
  selectedDiets: string[] = [];
  selectedMeals: string[] = [];
  selectedDishes: string[] = [];
  selectedCuisine: string[] = [];

  allergies: string[];
  diets: string[];
  mealTypes: string[];
  dishType: string[];
  cuisineType: string[];

  useDefault: boolean;

  profileEditForm = <FormGroup>{};

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private settingsService: SettingsService
  ) {
    this.allergies = productService.getAllergies();
    this.diets = productService.getDiets();
    this.mealTypes = productService.getMeals();
    this.dishType = productService.getDishes();
    this.cuisineType = productService.getCuisineTypes();

    this.userInfo = history.state["user"];
    this.settings = history.state["settings"];

    if (this.settings.allergyType === "") {
      this.selectedAllergies = [];
    } else {
      this.selectedAllergies = this.settings.allergyType.split(';');
    }

    if (this.settings.dietType === "") {
      this.selectedDiets = [];
    } else {
      this.selectedDiets = this.settings.dietType.split(';');
    }

    if (this.settings.mealType === "") {
      this.selectedMeals = [];
    } else {
      this.selectedMeals = this.settings.mealType.split(';');
    }

    if (this.settings.dishType === "") {
      this.selectedDishes = [];
    } else {
      this.selectedDishes = this.settings.dishType.split(';');
    }

    if (this.settings.cuisineType === "") {
      this.selectedCuisine = [];
    } else {
      this.selectedCuisine = this.settings.cuisineType.split(';');
    }

    this.useDefault = this.settings.useDefault;
  }

  ngOnInit(): void {
    this.profileEditForm = this.buildFormGroup();
  }

  buildFormGroup(): FormGroup{
    return this.fb.group({
      name: [this.userInfo.name, [Validators.required]],
      allergies: new FormControl(this.selectedAllergies),
      diets: new FormControl(this.selectedDiets),
      meals: new FormControl(this.selectedMeals),
      dishes: new FormControl(this.selectedDishes),
      cuisine: new FormControl(this.selectedCuisine),
      useDefault: new FormControl(this.useDefault)
    });
  };

  private getSettingsFromForm(): UserSettings {
    return {
      id: this.settings.id,
      userId: this.settings.userId,
      allergyType: this.profileEditForm.value.allergies.join(';'),
      dishType: this.profileEditForm.value.dishes.join(';'),
      mealType: this.profileEditForm.value.meals.join(';'),
      cuisineType: this.profileEditForm.value.cuisine.join(';'),
      dietType: this.profileEditForm.value.diets.join(';'),
      useDefault: this.profileEditForm.value.useDefault
    };
  }

  updateProfile() {
    if (this.userInfo.name !== this.profileEditForm.value.name) {
      const newUser = <UserInfo>{};
      newUser.name = this.profileEditForm.value.name;
      newUser.email = this.userInfo.email;
      this.authService.changeUserInfo(newUser).subscribe({
        next: (data) => {
        }
      });
    }
    const newSettings = this.getSettingsFromForm();
    if (
      this.settings.cuisineType !== newSettings.cuisineType ||
      this.settings.dishType !== newSettings.dishType ||
      this.settings.mealType !== newSettings.mealType ||
      this.settings.dietType !== newSettings.dietType ||
      this.settings.allergyType !== newSettings.allergyType ||
      this.settings.useDefault !== newSettings.useDefault
    )
    {
      this.settingsService.saveToServer(newSettings).subscribe({
        next: (data) => {
          this.settingsService.userSettings = data;
          this.settingsService.changeUserSettings();
        }
      })
    }
    this.router.navigate(['/profile']);
  }

}
