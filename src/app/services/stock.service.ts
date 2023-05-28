import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Issue} from '../models/issue';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Stock } from '../models/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  stockData:Stock[] = [
    {ticker: 'MSFT', shares: 2, cost: 200, avgPrice: 100},
    {ticker: 'AAPL', shares: 5, cost: 500, avgPrice: 100},
    {ticker: 'O', shares: 1, cost: 90, avgPrice: 90},
    {ticker: 'KO', shares: 10, cost: 550, avgPrice: 55},
    {ticker: 'NEE', shares: 1, cost: 110, avgPrice: 100},
    {ticker: 'MCD', shares: 0.5, cost: 50, avgPrice: 100},
    {ticker: 'SCHD', shares: 1, cost: 80, avgPrice: 80},
    {ticker: 'V', shares: 10, cost: 50, avgPrice: 5}
  ]

  dataChange: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);

  dialogData: any;

  constructor() { }

  get data(): Stock[] {
    return this.dataChange.value;
  }

  getAllIssues(): void {
    // this.httpClient.get<Issue[]>(this.API_URL).subscribe(data => {
    //     this.dataChange.next(data);
    //   },
    //   (error: HttpErrorResponse) => {
    //   console.log (error.name + ' ' + error.message);
    //   });

    this.dataChange.next(this.stockData);
  }

  getDialogData() {
    return this.dialogData;
  }

  addIssue (issue: Stock): void {
    this.dialogData = issue;
  }

  updateIssue (issue: Stock): void {
    this.dialogData = issue;
    
  }

  addShares (issue: Stock): void {
    this.dialogData = issue;
  }

  deleteIssue (id: number): void {
    console.log(id);
  }


}
