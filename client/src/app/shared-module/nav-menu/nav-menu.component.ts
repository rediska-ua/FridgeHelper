import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { LoginPopUpComponent } from 'src/app/modals/login-pop-up/login-pop-up.component';
import { AuthService } from '../auth/auth.service';
import { ConnectionService } from '../services/connection.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  private destroySubject = new Subject();
  isLoggedIn = false;
  showProfileDropdown = false;
  public connected = true;


  constructor(
    private dialogRef: MatDialog,
    private authService: AuthService,
    private router: Router,
    private connection: ConnectionService
  ) {
    this.authService.authStatus
      .pipe(takeUntil(this.destroySubject))
      .subscribe((result) => {
        this.isLoggedIn = result;
      });
    this.connected = this.connection.connected;
    connection.Changes.subscribe((state) => (this.connected = state));
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }

  openLogin() {
    this.dialogRef.open(LoginPopUpComponent);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  onBlur(): void {
    console.log('Focus Is Lost for this Element');
  }
}
