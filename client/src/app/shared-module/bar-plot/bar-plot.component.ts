import { Component, Input } from '@angular/core';

import { BarPlotVM } from './bar-plot-vm';

@Component({
  selector: 'app-bar-plot',
  templateUrl: './bar-plot.component.html',
  styleUrls: ['./bar-plot.component.scss'],
})
export class BarPlotComponent {
  @Input()
  viewModel = new BarPlotVM();

  @Input()
  isIntAxisLabel = false;

  @Input()
  classNameValue = "";

  get yAxis() {
    return this.calcYAxis(this.viewModel.dataSequence.map((ds) => ds.value));
  }

  private readonly defaultYAxis = ['0', '0', '0', '0', '0'];

  calcYAxis(values: number[]): string[] {
    if (values.length === 0) {
      return this.defaultYAxis;
    }

    let max = Math.max(...values);
    let min = Math.min(...values);
    let fixedTo: number;

    max = max % 1 === 0 ? max : Math.ceil(max);

    if (this.isIntAxisLabel) {
      while (max % 4 !== 0) {
        max++;
      }
    }

    if (max % 4 == 0) {
      fixedTo = 0;
    } else if (max % 2 == 0) {
      fixedTo = 1;
    } else {
      fixedTo = 2;
    }

    return [
      (max * 1.2).toFixed(fixedTo),
      max.toFixed(fixedTo),
      (max * 0.75).toFixed(fixedTo),
      (max * 0.5).toFixed(fixedTo),
      (max * 0.4).toFixed(fixedTo),
      min.toFixed(fixedTo),
    ];
  }

  calcBarHeight(value: number): number {
    return (value / Number(this.yAxis[0])) * 100;
  }
}
