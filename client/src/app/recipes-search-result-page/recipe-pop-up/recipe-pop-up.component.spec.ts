import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipePopUpComponent } from './recipe-pop-up.component';

describe('RecipePopUpComponent', () => {
  let component: RecipePopUpComponent;
  let fixture: ComponentFixture<RecipePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipePopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
