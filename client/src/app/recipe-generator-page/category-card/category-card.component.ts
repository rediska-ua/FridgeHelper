import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Ingredient } from "../../shared-module/types/ingredient-info";
import { Category } from "../../shared-module/types/category-info";

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})

export class CategoryCardComponent {
  @Input() ingredients!: Ingredient[];
  @Input() category: Category | undefined;
  @Input() selectedIngredients!: string[];
  @Input() searchString!: string;

  @Output() newItemEvent = new EventEmitter<string>();

  showCount = 10;

  showMore() {
    this.showCount = this.showCount + 10;
  }

  toggleSelection(value: string) {
    this.newItemEvent.emit(value);
  }


}
