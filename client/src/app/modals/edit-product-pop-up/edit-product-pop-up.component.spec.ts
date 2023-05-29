import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductPopUpComponent } from './edit-product-pop-up.component';

describe('EditTaskPopUpComponent', () => {
  let component: EditProductPopUpComponent;
  let fixture: ComponentFixture<EditProductPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditProductPopUpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProductPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
