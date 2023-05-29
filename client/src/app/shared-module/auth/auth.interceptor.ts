import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginPopUpComponent } from 'src/app/modals/login-pop-up/login-pop-up.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private dialogRef: MatDialog) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          error.url !== `${environment.baseUrl}account/login`
        ) {
          this.authService.logout();
          this.dialogRef.open(LoginPopUpComponent);
        }
        return throwError(() => error);
      })
    );
  }
}
