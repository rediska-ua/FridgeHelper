import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';

import {
  BarPlotUnitVM,
  BarPlotVM,
} from 'src/app/shared-module/bar-plot/bar-plot-vm';
import {AnalyticsPerMonth} from "../../types/analytics-month";
import {AnalyticsYear} from "../../types/analytics-year";
import { Month } from "../../types/month";
import {StatisticsService} from "../../services/statistics.service";
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-monthly-statistics',
  templateUrl: './monthly-statistics.component.html',
  styleUrls: ['./monthly-statistics.component.scss'],
})
export class MonthlyStatisticsComponent {
  @Input() statistics?: AnalyticsPerMonth;

  private _selectedMonth = new Date();
  barPlotVM = new BarPlotVM('Money spent in UAH', 'Day', 'Overall');

  @ViewChild('picker') datePicker?: MatDatepicker<Date>;
  @Output() monthSelectedEvent = new EventEmitter<Date>();

  maxDate: Date;
  Month = Month;

  constructor(private statisticsService: StatisticsService) {
    this.maxDate = new Date();
    this.maxDate.setDate(1);
    this.maxDate.setHours(0, 0, 0, 0);
  }

  statisticsNotFound = false;

  monthSelected(value: Date, picker: MatDatepicker<Date>) {
    this.selectedMonth = value;
    picker.close();
  }


  get selectedMonth(): Date {
    return this._selectedMonth;
  }

  set selectedMonth(value: Date) {
    this._selectedMonth = value;
    this.loadMonthlyStatistics();
    this.monthSelectedEvent.emit(value);
  }

  get dateInputRightArrowState(): string {
    return this.selectedMonth < this.maxDate ? 'active' : 'unactive';
  }

  ngOnInit(): void {
    this.loadMonthlyStatistics();
  }

  openDatePicker() {
    this.datePicker?.open();
  }

  dateInputLeftArrowClick() {
    const currMonth = this.selectedMonth.getMonth();
    this.selectedMonth = new Date(
      this.selectedMonth.getFullYear(),
      currMonth - 1
    );
  }

  dateInputRightArrowClick() {
    if (this.selectedMonth < this.maxDate) {
      const currMonth = this.selectedMonth.getMonth();
      this.selectedMonth = new Date(
        this.selectedMonth.getFullYear(),
        currMonth + 1
      );
    }
  }

  private loadMonthlyStatistics() {
    this.statisticsService
      .getMonthlyStatistics(this._selectedMonth.getFullYear(), this._selectedMonth.getMonth())
      .subscribe((result) => this.updateBarPlotVM(result));
  }

  private updateBarPlotVM(data: AnalyticsPerMonth) {
    this.barPlotVM.clearData();
    this.statisticsNotFound = data.productBought.length === 0;

    const xAxis = [];
    for (let i = 1; i <= 31; i++) {
      xAxis.push(i.toString());
    }

    if (this.statisticsNotFound) {
      this.barPlotVM.addDefaultData(xAxis);
      return;
    }

    xAxis.forEach((apm) => {
      const productBoughtOnDay = data.productBought.filter(p =>
       (parseInt(p.creationDate.toString().split('-')[1])) === this.selectedMonth.getMonth() + 1
      && (parseInt(p.creationDate.toString().split('-')[2].substring(0, 2))) === parseInt(apm));

      let sum = 0;
      for (let product of productBoughtOnDay) {
        sum += product.price;
      }

      this.barPlotVM.dataSequence.push(
        new BarPlotUnitVM(
          `${apm}`,
          sum,
          `${sum} spent on day ${apm}`
        )
      );
    });
  }
}
