import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyStatisticsComponent } from './monthly-statistics.component';

describe('MonthlyStatisticsComponent', () => {
  let component: MonthlyStatisticsComponent;
  let fixture: ComponentFixture<MonthlyStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyStatisticsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlyStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
