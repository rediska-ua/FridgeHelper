import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserSettings} from "../../shared-module/types/user-settings";
import {SettingsService} from "../../shared-module/services/settings.service";

@Component({
  selector: 'app-additional-filters-section',
  templateUrl: './additional-filters-section.component.html',
  styleUrls: ['./additional-filters-section.component.scss']
})
export class AdditionalFiltersSectionComponent implements OnInit {
  @Input() allergies!: string[];
  @Input() diets!: string[];
  @Input() mealTypes!: string[];
  @Input() dishType!: string[];
  @Input() cuisineType!: string[]
  @Input() isLogged!: boolean;
  userSettings: UserSettings = <UserSettings> {};

  @Input() selectedAllergies: string[] = [];
  @Output() selectedAllergiesChange = new EventEmitter<string[]>();

  @Input() selectedDiets: string[] = [];
  @Output() selectedDietsChange = new EventEmitter<string[]>();

  @Input() selectedMeals: string[] = [];
  @Output() selectedMealsChange = new EventEmitter<string[]>();

  @Input() selectedDishes: string[] = [];
  @Output() selectedDishesChange = new EventEmitter<string[]>();

  @Input() selectedCuisine: string[] = [];
  @Output() selectedCuisineChange = new EventEmitter<string[]>();

  constructor(
    private settingsService: SettingsService
  ) {
  }

  ngOnInit(): void {
    if (this.isLogged) {
      this.settingsService.getFromServer().subscribe({
        next: (settings) => {
          this.userSettings = settings;

          if (settings.useDefault) {
            if (this.userSettings.allergyType === "") {
              this.selectedAllergies = [];
            } else {
              this.selectedAllergies = this.userSettings.allergyType.split(';');
              this.selectedAllergiesChange.emit(this.selectedAllergies);
            }

            if (this.userSettings.dietType === "") {
              this.selectedDiets = [];
            } else {
              this.selectedDiets = this.userSettings.dietType.split(';');
              this.selectedDietsChange.emit(this.selectedDiets);
            }

            if (this.userSettings.mealType === "") {
              this.selectedMeals = [];
            } else {
              this.selectedMeals = this.userSettings.mealType.split(';');
              this.selectedMealsChange.emit(this.selectedMeals);
            }

            if (this.userSettings.dishType === "") {
              this.selectedDishes = [];
            } else {
              this.selectedDishes = this.userSettings.dishType.split(';');
              this.selectedDishesChange.emit(this.selectedDishes);
            }

            if (this.userSettings.cuisineType === "") {
              this.selectedCuisine = [];
            } else {
              this.selectedCuisine = this.userSettings.cuisineType.split(';');
              this.selectedCuisineChange.emit(this.selectedCuisine);
            }
          }
        }
      })
    }
  }

  changeAllergies(event: any) {
    this.selectedAllergiesChange.emit(event);
  }

  changeDiets(event: any) {
    this.selectedDietsChange.emit(event);
  }

  changeDishes(event: any) {
    this.selectedDishesChange.emit(event);
  }

  changeMeals(event: any) {
    this.selectedMealsChange.emit(event);
  }

  changeCuisine(event: any) {
    this.selectedCuisineChange.emit(event);
  }
}
