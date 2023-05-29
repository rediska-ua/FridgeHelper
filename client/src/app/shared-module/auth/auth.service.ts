import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, tap} from 'rxjs';
import jwt_decode from 'jwt-decode';

import { LoginRequest } from '../types/login-request';
import { LoginResult } from '../types/login-result';
import { environment } from 'src/environments/environment';
import { SignupInfoRequest } from '../types/signup-request';
import { SignupResult } from '../types/signup-result';
import { Guid } from '../types/guid';
import { DOCUMENT } from '@angular/common';
import {UserInfo} from "../types/user-info";
import {UserSettings} from "../types/user-settings";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'token';
  private readonly userIdClaim = 'userId';
  private readonly userNameClaim =
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';


  private _authStatus = new Subject<boolean>();
  public authStatus = this._authStatus.asObservable();


  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): string {
    return this.getClaim(this.userIdClaim) ?? Guid.empty;
  }

  getUserName(): string {
    return this.getClaim(this.userNameClaim) ?? '';
  }

  init(): void {
    if (this.isAuthenticated()) {
      this.setAuthStatus(true);
    }
  }

  completeAuth(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.setAuthStatus(true);
  }

  getUserInfo(): Observable<UserInfo> {
    const url = environment.baseUrl + 'UserInfo/getUserInfo';
    return this.http.get<UserInfo>(url);
  }

  changeUserInfo(newInfo: UserInfo): Observable<UserInfo> {
    const url = environment.baseUrl + 'UserInfo/getUserInfo';
    return this.http.put<UserInfo>(url, newInfo);
  }


  signup(item: SignupInfoRequest): Observable<SignupResult> {
    const url = environment.baseUrl + 'account/registration';
    return this.http.post<SignupResult>(url, item);
  }

  login(item: LoginRequest): Observable<LoginResult> {
    const url = environment.baseUrl + 'account/login';
    return this.http.post<LoginResult>(url, item).pipe(
      tap((loginResult) => {
        if (loginResult.success && loginResult.token) {
          this.completeAuth(loginResult.token);
        }
      })
    );
  }

  externalLogin(provider: string, returnUrl: string): void {
    this.document.location.href =
      environment.baseUrl +
      `account/external-login?provider=${provider}&returnUrl=${returnUrl}`;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.setAuthStatus(false);
  }

  private setAuthStatus(isAuthenticated: boolean): void {
    this._authStatus.next(isAuthenticated);
  }

  private getClaim(claim: string): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwt_decode(token);
      return decodedToken[claim];
    }
    return null;
  }
}
