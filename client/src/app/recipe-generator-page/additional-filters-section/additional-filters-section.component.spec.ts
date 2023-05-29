import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalFiltersSectionComponent } from './additional-filters-section.component';

describe('AdditionalFiltersSectionComponent', () => {
  let component: AdditionalFiltersSectionComponent;
  let fixture: ComponentFixture<AdditionalFiltersSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalFiltersSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalFiltersSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
