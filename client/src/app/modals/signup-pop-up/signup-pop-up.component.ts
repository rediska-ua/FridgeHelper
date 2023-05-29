import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared-module/auth/auth.service';
import { AuthMatDialogData } from 'src/app/shared-module/types/auth-mat-dialog-data';
import { ExternalLoginProviders } from 'src/app/shared-module/types/external-login-providers';
import { SignupInfoRequest } from 'src/app/shared-module/types/signup-request';
import { SignupResult } from 'src/app/shared-module/types/signup-result';

import { MatchValidator } from 'src/app/shared-module/validation/match';
import { LoginPopUpComponent } from '../login-pop-up/login-pop-up.component';

@Component({
  selector: 'app-signup-pop-up',
  templateUrl: './signup-pop-up.component.html',
  styleUrls: [
    '../login-pop-up/login-pop-up.component.scss',
    './signup-pop-up.component.scss',
  ],
})
export class SignupPopUpComponent {
  signupInfoRequest = <SignupInfoRequest>{};
  signupInfoResult?: SignupResult;

  signUpForm: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.pattern('^[A-Za-z ]+$')],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      MatchValidator.Match('confirmPassword', true),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      MatchValidator.Match('password'),
    ]),
    agreement: new FormControl('', [Validators.requiredTrue]),
  });

  private readonly returnUrl: string;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) private authMatDialogData?: AuthMatDialogData
  ) {
    this.returnUrl = authMatDialogData?.returnUrl ?? '/';
  }

  public onSubmit(): void {
    if (this.signUpForm.valid) {
      this.signupInfoRequest.userName = this.signUpForm.controls['name'].value;
      this.signupInfoRequest.email = this.signUpForm.controls['email'].value;
      this.signupInfoRequest.password = this.signUpForm.controls['password'].value;
      this.signupInfoRequest.confirmPassword = this.signUpForm.controls['confirmPassword'].value;

      this.authService.signup(this.signupInfoRequest).subscribe({
        next: (result) => {
          this.signupInfoResult = result;
          if (result.success) {
            console.log(result);
            this.dialog.closeAll();
            this.dialog.open(LoginPopUpComponent, {
              data: this.authMatDialogData,
            });
            //this.toConfirmEmail();
          }
        },
        error: (error) => {
          if (!error?.error?.success) {
            this.signupInfoResult = error.error;
            this.resetForm();
          }
        },
      });
    }
  }

  public onSignIn(): void {
    this.toSignIn();
  }

  public resetForm(): void {
    this.signupInfoRequest = <SignupInfoRequest>{};
    this.signUpForm.reset();
  }

  public signUpViaGoogle(): void {
    this.authService.externalLogin(
      ExternalLoginProviders.Google,
      this.returnUrl
    );
  }

  private toSignIn(): void {
    this.dialog.closeAll();
    this.dialog.open(LoginPopUpComponent, {
      data: this.authMatDialogData,
    });
  }
}
