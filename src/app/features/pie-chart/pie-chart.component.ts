import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApexChart, ApexLegend, ApexNonAxisChartSeries } from 'ng-apexcharts';
import { Stock } from '../../models/stock';
import * as ApexCharts from 'apexcharts';
import { PieChartRefreshService } from './../../services/pie-chart-refresh.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @Input() data: any;

  chartSeries: ApexNonAxisChartSeries = [10, 20, 30, 10, 5, 25];
  chartLabels: string[];

  chartDetails: ApexChart = {
    id: 'Stock-Data',
    type: 'pie',
    toolbar: {
      show: false
    }
  }

  chartLegend: ApexLegend = {
    show: false
  }

  constructor(private notificationService: PieChartRefreshService) {}

  ngOnInit(): void {  
    let total = this.data.reduce((accumulator, currentValue) => accumulator + currentValue.cost, 0)
    let newSeries = this.data.map(obj => obj.cost / total);
    this.chartSeries = newSeries;
    
    this.notificationService.notify$.subscribe((changedStocks:Stock[]) => {
      const chart = ApexCharts.getChartByID('Stock-Data');
      total = changedStocks.reduce((accumulator, currentValue) => accumulator + currentValue.cost, 0)
      newSeries = changedStocks.map(obj => obj.cost / total);
      const newLabels = changedStocks.map(obj => obj.ticker);
      chart.updateSeries(newSeries);
      chart.updateOptions({
        labels: newLabels,
      });
    });
  }
}
