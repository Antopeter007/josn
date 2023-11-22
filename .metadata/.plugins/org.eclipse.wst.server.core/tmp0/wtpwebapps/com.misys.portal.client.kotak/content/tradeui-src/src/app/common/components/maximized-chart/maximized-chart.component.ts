import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng';
@Component({
  selector: 'fcc-common-maximized-chart',
  templateUrl: './maximized-chart.component.html',
  styleUrls: ['./maximized-chart.component.css']
})
export class MaximizedChartComponent implements OnInit {

  public chartData;
  public chartOption;
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.chartData = this.config.data.id;
    this.chartOption = this.config.data.options;
  }
}
