import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../shared-module/types/product";
import {MatDialog} from "@angular/material/dialog";
import {RecipePopUpComponent} from "../recipe-pop-up/recipe-pop-up.component";

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit {
  @Input() recipe!: any;
  @Input() matchNumber!: any;

  caloriesToShow!: number;

  constructor(
  ) {
  }

  ngOnInit(): void {
    this.caloriesToShow = Math.round(100 * this.recipe.calories / this.recipe.totalWeight);
  }

}
