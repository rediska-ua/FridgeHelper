import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AuthService } from './shared-module/auth/auth.service';
import { RecipeService } from "./shared-module/services/recipe.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  defaultTitle = 'FridgeHelper';

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.init();
  }

}
