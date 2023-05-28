import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApexChart, ApexLegend, ApexNonAxisChartSeries } from 'ng-apexcharts';
import { Stock } from '../../models/stock';
import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnChanges, OnInit {
  @Input() data: any;

  chartSeries: ApexNonAxisChartSeries = [10, 20, 30, 10, 5, 25];
  chartLabels: string[];

  chartDetails: ApexChart = {
    id: 'Stock-Data',
    type: 'pie',
    toolbar: {
      show: false
    },

  }

  chartLegend: ApexLegend = {
    show: false
  }


  constructor() { }

  ngOnInit(): void {
    this.loadChartData();
    const chart = ApexCharts.getChartByID('Stock-Data');
    console.log(chart);
    
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    
    if (changes.chartValues) {
      this.loadChartData();
      this.updateChart()
    }
  }

  loadChartData() {
    const total = this.data.reduce((accumulator, currentValue) => accumulator + currentValue.cost, 0)
    this.chartSeries = this.data.map(obj => obj.cost / total);
    this.chartLabels = this.data.map(obj => obj.ticker);
    console.log(total);
    
    
    const chart = ApexCharts.getChartByID('Stock-Data');
    console.log(chart);
  }

  updateChart() {
    const chart = ApexCharts.getChartByID('Stock-Data');
    if (chart) {
      chart.updateSeries(this.chartSeries);
      console.log(chart);
      
    }
  }

}
