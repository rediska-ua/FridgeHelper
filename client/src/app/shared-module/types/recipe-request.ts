export interface RecipeRequest {
  type: string,
  q: string,
  app_id: string,
  app_key: string,
  diet: string[],
  health: string[],
  cuisineType: string[],
  mealType: string[],
  dishType: string[],
}
