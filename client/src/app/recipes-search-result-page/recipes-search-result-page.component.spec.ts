import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesSearchResultPageComponent } from './recipes-search-result-page.component';

describe('AllRecipesSectionComponent', () => {
  let component: RecipesSearchResultPageComponent;
  let fixture: ComponentFixture<RecipesSearchResultPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipesSearchResultPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesSearchResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
