export class BarPlotVM {
  constructor(
    public yAxisTitle?: string,
    public xAxisTitle?: string,
    public tooltipTitle?: string,
    public dataSequence: BarPlotUnitVM[] = []
  ) {}

  isEmpty(): boolean {
    return this.dataSequence.every((entry) => entry.value === 0);
  }

  clearData(): void {
    this.dataSequence = [];
  }

  addDefaultData(xAxis: string[]): void {
    xAxis.forEach((xTitle) => {
      this.dataSequence.push(new BarPlotUnitVM(xTitle, 0));
    });
  }
}

export class BarPlotUnitVM {
  constructor(
    public barTitle: string,
    public value: number,
    public tooltipValue?: string
  ) {}
}
