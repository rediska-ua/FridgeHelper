import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientSelectionSectionComponent } from './ingredient-selection-section.component';

describe('IngredientSelectionSectionComponent', () => {
  let component: IngredientSelectionSectionComponent;
  let fixture: ComponentFixture<IngredientSelectionSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientSelectionSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientSelectionSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
