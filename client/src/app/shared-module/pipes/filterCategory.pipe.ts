import {Pipe, PipeTransform} from '@angular/core';
import {IngredientFullInfo} from "../types/ingredient-full-info";


@Pipe({ name: 'filterCategories' })
export class FilterCategoryPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */


  transform(items: IngredientFullInfo[], searchText: string): any[] {
    console.log(searchText);
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    const filteredIngredients = items.filter(it => {
      return it.value.toLocaleLowerCase().includes(searchText);
    });

    return [...new Set(filteredIngredients.map(item => item.categoryId))];
  }
}
