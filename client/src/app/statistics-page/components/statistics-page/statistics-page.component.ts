import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import {ProductService} from "../../../shared-module/services/product.service";
import {Product} from "../../../shared-module/types/product";
import {AnalyticsPerMonth} from "../../types/analytics-month";
import {DailyStatisticsComponent} from "../daily-statistics/daily-statistics.component";
import {AnalyticsDay} from "../../types/analytics-day";

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss'],
})
export class StatisticsPageComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private statisticsService: StatisticsService
  ) {}

  boughtProducts: Product[] = [];
  monthlyStatistics?: AnalyticsPerMonth;

  ngOnInit() {
    this.loadProductList(new Date());
    this.loadMonthlyStatistics(new Date());
  }

  dateOnSelect(date: Date) {
    console.log(date);
    console.log(this.boughtProducts.length);
    this.loadProductList(date);
  }

  yearOnSelect(month: Date) {
    //this.loadMonthlyStatistics(month);
  }

  private loadMonthlyStatistics(date: Date): void {
    this.statisticsService
      .getMonthlyStatistics(date.getFullYear(), date.getMonth())
      .subscribe((res) => {
        if (res) {
          this.monthlyStatistics = res;
        }
      });
  }

  private loadProductList(date: Date): void {
    this.statisticsService.getDailyStatistics(date).subscribe({
      next: (statistics: AnalyticsDay) => {
        console.log("date: " + date);
        this.boughtProducts = statistics.productBought;
        console.log("product length " + statistics.productBought.length);
      },
      error: (err: Error) => {
        this.boughtProducts = [];
        console.log('Error on statistics page: ', err.message);
      },
    });
  }
}
