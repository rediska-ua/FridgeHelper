import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import {
  BarPlotUnitVM,
  BarPlotVM,
} from 'src/app/shared-module/bar-plot/bar-plot-vm';
import { StatisticsService } from '../../services/statistics.service';
import { AnalyticsYear } from '../../types/analytics-year';
import { Month } from "../../types/month";

@Component({
  selector: 'app-annual-statistics',
  templateUrl: './annual-statistics.component.html',
  styleUrls: ['./annual-statistics.component.scss'],
})
export class AnnualStatisticsComponent implements OnInit {
  @ViewChild('picker') datePicker?: MatDatepicker<Date>;
  @Output() yearSelectedEvent = new EventEmitter<Date>();
  private _selectedYear = new Date();

  maxDate: Date;
  Month = Month;

  barPlotVM = new BarPlotVM('Money spent in UAH', 'Month', 'Overall');
  statisticsNotFound = false;

  constructor(private statisticsService: StatisticsService) {
    this.maxDate = new Date();
    this.maxDate.setDate(1);
    this.maxDate.setHours(0, 0, 0, 0);
  }

  private readonly annualStatisticsXAxis: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  get selectedYear(): Date {
    return this._selectedYear;
  }

  set selectedYear(value: Date) {
    this._selectedYear = value;
    this.loadAnnualStatistics();
    this.yearSelectedEvent.emit(value);
  }

  get dateInputRightArrowState(): string {
    return this.selectedYear.getFullYear() < this.maxDate.getFullYear() ? 'active' : 'unactive';
  }

  ngOnInit(): void {
    this.selectedYear = this.maxDate;
    this.loadAnnualStatistics();
  }

  openDatePicker() {
    this.datePicker?.open();
  }

  yearSelected(value: Date, picker: MatDatepicker<Date>) {
    this.selectedYear = value;
    picker.close();
  }

  dateInputLeftArrowClick() {
    const currYear = this.selectedYear.getFullYear();

    console.log(currYear);
    this.selectedYear = new Date(
      currYear - 1,
      1
    );
  }

  dateInputRightArrowClick() {
    if (this.selectedYear.getFullYear() < this.maxDate.getFullYear()) {
      const currYear = this.selectedYear.getFullYear();
      this.selectedYear = new Date(
        currYear + 1,
        1
      );
    }
  }

  private loadAnnualStatistics() {
    this.statisticsService
      .getAnnualStatistics(this._selectedYear.getFullYear())
      .subscribe((result) => this.updateBarPlotVM(result));
  }

  private updateBarPlotVM(data: AnalyticsYear) {
    this.barPlotVM.clearData();
    this.statisticsNotFound = data.analyticsPerMonths.length === 0;

    if (this.statisticsNotFound) {
      this.barPlotVM.addDefaultData(this.annualStatisticsXAxis);
      return;
    }

    data.analyticsPerMonths.forEach((apm) => {
      this.barPlotVM.dataSequence.push(
        new BarPlotUnitVM(
          `${Month[apm.month]}`,
          apm.moneySpent,
          `${apm.moneySpent} spent`
        )
      );
    });
  }
}
