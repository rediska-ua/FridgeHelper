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
import { AnalyticsDay } from '../../types/analytics-day';

@Component({
  selector: 'app-daily-statistics',
  templateUrl: './daily-statistics.component.html',
  styleUrls: ['./daily-statistics.component.scss'],
})
export class DailyStatisticsComponent implements OnInit {
  @ViewChild('picker') datePicker?: MatDatepicker<Date>;
  @Output() dateSelectedEvent = new EventEmitter<Date>();

  maxDate: Date;
  barPlotVM = new BarPlotVM('Money in UAH', 'Hour', 'Money spent');
  statisticsNotFound = false;

  constructor(private statisticsService: StatisticsService) {
    this.maxDate = new Date();
    this.maxDate.setHours(0, 0, 0, 0);
  }

  private _selectedDay: Date = new Date();

  get selectedDay(): Date {
    return this._selectedDay;
  }

  set selectedDay(value: Date) {
    this._selectedDay = value;
    this.loadDailyStatistics();
    this.dateSelectedEvent.emit(value);
  }

  get dateInputRightArrowState(): string {
    return this.selectedDay < this.maxDate ? 'active' : 'unactive';
  }

  ngOnInit(): void {
    this.loadDailyStatistics();
  }

  openDatePicker() {
    this.datePicker?.open();
  }

  dateInputLeftArrowClick() {
    const currDate = this.selectedDay.getDate();
    this.selectedDay = new Date(
      this.selectedDay.getFullYear(),
      this.selectedDay.getMonth(),
      currDate - 1
    );
  }

  dateInputRightArrowClick() {
    if (this.selectedDay < this.maxDate) {
      const currDate = this.selectedDay.getDate();
      this.selectedDay = new Date(
        this.selectedDay.getFullYear(),
        this.selectedDay.getMonth(),
        currDate + 1
      );
    }
  }

  private loadDailyStatistics(): void {
    this.statisticsService
      .getDailyStatistics(this._selectedDay)
      .subscribe((result) => result);
  }

}
