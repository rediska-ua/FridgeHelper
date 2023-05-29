import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { LoginPopUpComponent } from 'src/app/modals/login-pop-up/login-pop-up.component';
import { AuthService } from '../auth/auth.service';
import { ConnectionService } from '../services/connection.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  private destroySubject = new Subject();
  isLoggedIn = false;
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
  /*openSettings() {
    this.dialogRef.open(SettingsPopUpComponent);
  }*/

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
