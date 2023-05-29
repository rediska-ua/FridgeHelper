import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeGeneratorPageComponent } from './recipe-generator-page.component';

describe('RecipeGeneratorPageComponent', () => {
  let component: RecipeGeneratorPageComponent;
  let fixture: ComponentFixture<RecipeGeneratorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeGeneratorPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
