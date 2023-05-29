import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductPopUpComponent } from './create-product-pop-up.component';

describe('CreateTaskPopUpComponent', () => {
  let component: CreateProductPopUpComponent;
  let fixture: ComponentFixture<CreateProductPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProductPopUpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
