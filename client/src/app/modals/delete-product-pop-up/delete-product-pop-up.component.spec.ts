import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProductPopUpComponent } from './delete-product-pop-up.component';

describe('DeleteTaskPopUpComponent', () => {
  let component: DeleteProductPopUpComponent;
  let fixture: ComponentFixture<DeleteProductPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteProductPopUpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProductPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
