import { Pipe, PipeTransform } from '@angular/core';

interface Ingredient {
  name: string;
  selected: boolean;
  category: string;
}

@Pipe({ name: 'filterIngredients' })
export class FilterIngredientsPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */

  transform(items: Ingredient[], searchText: string): any[] {
    console.log(items);
    console.log(searchText);
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      return it.name.toLocaleLowerCase().includes(searchText);
    });
  }
}
