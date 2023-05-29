import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './shared-module/auth/auth.guard';
import { StatisticsPageComponent } from './statistics-page/components/statistics-page/statistics-page.component';
import { RecipeGeneratorPageComponent } from "./recipe-generator-page/recipe-generator-page.component";
import { RecipesSearchResultPageComponent } from "./recipes-search-result-page/recipes-search-result-page.component";
import { InventoryPageComponent } from "./inventory-page/inventory-page.component";
import { ProfilePageComponent } from "./profile-page/profile-page.component";
import { ProfileEditPageComponent } from "./profile-edit-page/profile-edit-page.component";

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'statistics',
    component: StatisticsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'recipe-generator',
    component: RecipeGeneratorPageComponent
  },
  {
    path: 'recipe-search-result',
    component: RecipesSearchResultPageComponent
  },
  {
    path: 'inventory',
    component: InventoryPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-profile',
    component: ProfileEditPageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
