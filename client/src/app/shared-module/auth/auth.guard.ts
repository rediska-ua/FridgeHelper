import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { LoginPopUpComponent } from 'src/app/modals/login-pop-up/login-pop-up.component';
import { AuthMatDialogData } from '../types/auth-mat-dialog-data';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private dialogRef: MatDialog) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.dialogRef.open(LoginPopUpComponent, {
      data: <AuthMatDialogData>{
        returnUrl: state.url,
      },
    });
    return false;
  }
}
