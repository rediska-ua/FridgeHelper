import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './shared-module/nav-menu/nav-menu.component';
import { HomePageComponent } from './home-page/home-page.component';
import { WelcomeMessageComponent } from './home-page/welcome-message/welcome-message.component';
import { ProductListComponent } from './shared-module/product-list/product-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LoginPopUpComponent } from './modals/login-pop-up/login-pop-up.component';
import { StatisticsPageComponent } from './statistics-page/components/statistics-page/statistics-page.component';
import { DailyStatisticsComponent } from './statistics-page/components/daily-statistics/daily-statistics.component';
import { AnnualStatisticsComponent } from './statistics-page/components/annual-statistics/annual-statistics.component';
import { MonthlyStatisticsComponent } from './statistics-page/components/monthly-statistics/monthly-statistics.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthInterceptor } from './shared-module/auth/auth.interceptor';
import { ValidationHelper } from './shared-module/pipes/validation-helper';
import { ValidationErrorsDirective } from './shared-module/directives/validation-errors.directive';
import { BarPlotComponent } from './shared-module/bar-plot/bar-plot.component';
import { SignupPopUpComponent } from './modals/signup-pop-up/signup-pop-up.component';
import { MatMenuModule } from '@angular/material/menu';
import { EditProductPopUpComponent } from './modals/edit-product-pop-up/edit-product-pop-up.component';
import { MatSelectModule } from '@angular/material/select';
import { DeleteProductPopUpComponent } from './modals/delete-product-pop-up/delete-product-pop-up.component';
import { DatePipe } from '@angular/common';
import { CreateProductPopUpComponent } from './modals/create-product-pop-up/create-product-pop-up.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { FooterComponent } from './shared-module/footer/footer.component';
import { InventoryPageComponent } from "./inventory-page/inventory-page.component";
import { RecipeGeneratorPageComponent } from './recipe-generator-page/recipe-generator-page.component';
import { RecipesSearchResultPageComponent } from './recipes-search-result-page/recipes-search-result-page.component';
import { IngredientSelectionSectionComponent } from './recipe-generator-page/ingredient-selection-section/ingredient-selection-section.component';
import {
  AdditionalFiltersSectionComponent
} from "./recipe-generator-page/additional-filters-section/additional-filters-section.component";
import { FilterCategoryPipe } from "./shared-module/pipes/filterCategory.pipe";
import { FilterIngredientsPipe } from "./shared-module/pipes/filterIngredients.pipe";
import { HighlightDirective } from "./shared-module/directives/highlight.directive";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { NgSelectModule } from "@ng-select/ng-select";
import { CategoryCardComponent } from './recipe-generator-page/category-card/category-card.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { RecipeCardComponent } from './recipes-search-result-page/recipe-card/recipe-card.component';
import { ProfileEditPageComponent } from './profile-edit-page/profile-edit-page.component';
import { SpinnerComponent } from './shared-module/spinner/spinner.component';
import { LoadingInterceptor } from "./shared-module/interseptors/loading.interceptor";
import { ProductCardComponent } from './inventory-page/product-card/product-card.component';
import { MatCardModule } from "@angular/material/card";
import { ProfilePageComponent } from "./profile-page/profile-page.component";
import { RecipePopUpComponent } from './recipes-search-result-page/recipe-pop-up/recipe-pop-up.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { ErrorPageComponent } from './error-page/error-page.component';
import { DeleteConfirmPopUpComponent } from './modals/delete-confirm-pop-up/delete-confirm-pop-up.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomePageComponent,
    WelcomeMessageComponent,
    LoginPopUpComponent,
    StatisticsPageComponent,
    DailyStatisticsComponent,
    AnnualStatisticsComponent,
    MonthlyStatisticsComponent,
    ValidationHelper,
    ValidationErrorsDirective,
    BarPlotComponent,
    SignupPopUpComponent,
    EditProductPopUpComponent,
    DeleteProductPopUpComponent,
    CreateProductPopUpComponent,
    FooterComponent,
    InventoryPageComponent,
    RecipeGeneratorPageComponent,
    RecipesSearchResultPageComponent,
    IngredientSelectionSectionComponent,
    AdditionalFiltersSectionComponent,
    HighlightDirective,
    CategoryCardComponent,
    FilterCategoryPipe,
    FilterIngredientsPipe,
    RecipeCardComponent,
    ProfileEditPageComponent,
    SpinnerComponent,
    ProductCardComponent,
    ProfilePageComponent,
    RecipePopUpComponent,
    ProductListComponent,
    HomePageComponent,
    ErrorPageComponent,
    DeleteConfirmPopUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    MatDialogModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSelectModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    MatChipsModule,
    MatAutocompleteModule,
    MatInputModule,
    ButtonsModule,
    NgSelectModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    Title,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
