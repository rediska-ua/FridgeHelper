import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPopUpComponent } from './login-pop-up.component';

describe('LoginPopUpComponent', () => {
  let component: LoginPopUpComponent;
  let fixture: ComponentFixture<LoginPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPopUpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
