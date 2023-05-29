import { AnalyticsPerMonth } from './analytics-month';

export interface AnalyticsYear {
  userId: string;
  year: number;
  analyticsPerMonths: Array<AnalyticsPerMonth>;
}
