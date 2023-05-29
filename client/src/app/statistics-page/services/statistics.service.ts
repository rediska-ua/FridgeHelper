import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnalyticsYear } from '../types/analytics-year';
import { AnalyticsDay } from '../types/analytics-day';
import {AnalyticsPerMonth} from "../types/analytics-month";

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  private readonly statisticsUrl = environment.baseUrl + 'UserStatistics';

  getDailyStatistics(date: Date): Observable<AnalyticsDay> {
    const url = `${this.statisticsUrl}/daily/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return this.http
      .get<AnalyticsDay>(url)
      .pipe(catchError(this.handleError));
  }

  getMonthlyStatistics(
    year: number,
    month: number
  ): Observable<AnalyticsPerMonth> {
    const url = `${this.statisticsUrl}/monthly/${year}/${month + 1}`;
    return this.http
      .get<AnalyticsPerMonth>(url)
      .pipe(catchError(this.handleError));
  }

  getAnnualStatistics(year: number): Observable<AnalyticsYear> {
    const url = `${this.statisticsUrl}/annual/${year}`;
    return this.http
      .get<AnalyticsYear>(url)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error));
  }
}
