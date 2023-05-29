import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPopUpComponent } from './signup-pop-up.component';

describe('SignupPopUpComponent', () => {
  let component: SignupPopUpComponent;
  let fixture: ComponentFixture<SignupPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupPopUpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
