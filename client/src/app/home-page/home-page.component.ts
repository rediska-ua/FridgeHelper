import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { LoginPopUpComponent } from 'src/app/modals/login-pop-up/login-pop-up.component';

import { AuthService } from 'src/app/shared-module/auth/auth.service';
import { AuthMatDialogData } from 'src/app/shared-module/types/auth-mat-dialog-data';
import { LoginResult } from 'src/app/shared-module/types/login-result';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers: [CookieService],
})
export class HomePageComponent implements OnInit, OnDestroy {
  private destroySubject = new Subject();
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog
  ) {
    this.authService.authStatus
      .pipe(takeUntil(this.destroySubject))
      .subscribe((result) => {
        this.isLoggedIn = result;
      });
    this.completeExternalLogin();
  }

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  completeExternalLogin() {
    const returnUrlKey = 'returnUrl';
    const externalLoginResponseKey = 'ExternalLoginResponse';

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params) {
        const urlToReturn = params[returnUrlKey];
        if (urlToReturn) {
          const response = this.cookieService.get(externalLoginResponseKey);
          if (response) {
            const result: LoginResult = JSON.parse(response);
            if (result.success && result.token) {
              this.authService.completeAuth(result.token);
              this.router.navigate([urlToReturn]);
              this.cookieService.delete(externalLoginResponseKey);
            } else {
              this.matDialog.open(LoginPopUpComponent, {
                data: <AuthMatDialogData>{
                  returnUrl: urlToReturn,
                  serverResponse: result.message,
                },
              });
            }
          }
        }
      }
    });
  }
}
