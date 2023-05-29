import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, throwError} from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Guid } from '../types/guid';
import { UserSettings } from '../types/user-settings';
import {Product} from "../types/product";

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  public userSettings: UserSettings = <UserSettings> {};
  private  userSettingsSource = new BehaviorSubject<UserSettings>(this. userSettings);
  userSettingsChanged = this. userSettingsSource.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    console.log("initial of settings service");
    console.log("Authenticated: " + authService.isAuthenticated());
    if (authService.isAuthenticated()) {
      this.getFromServer().subscribe({
        next: (settings: UserSettings) => {
          this.userSettings = settings;
          this.changeUserSettings();
        },
        error: (error: Error) => {
          console.log('Error occurred while getting settings: ' + error.message);
        },
      });
    }
  }

  private readonly settingsIdKey = 'settingsId';
  private readonly userIdKey = 'userId';

  private readonly url = `${environment.baseUrl}usersettings`;

  public getFromServer(): Observable<UserSettings> {
    return this.http.get<UserSettings>(this.url).pipe(
      map((res) => {
          return res;
      }),
    );
  }

  public saveToServer(userSettings: UserSettings): Observable<UserSettings> {
    const userId = this.authService.getUserId();
    return this.http.put<UserSettings>(`${this.url}/${userSettings.id}`, userSettings);
  }

  changeUserSettings() {
    this.userSettingsSource.next(this.userSettings);
  }

}
