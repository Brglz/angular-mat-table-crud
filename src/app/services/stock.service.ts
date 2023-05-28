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
    {ticker: 'MSFT', shares: 2, cost: 27, avgPrice: 13.99},
    {ticker: 'AAPL', shares: 13, cost: 40, avgPrice: 14.23},
    {ticker: 'O', shares: 3, cost: 40, avgPrice: 26.01},
    {ticker: 'KO', shares: 18, cost: 40, avgPrice: 17.1},
    {ticker: 'NEE', shares: 2, cost: 40, avgPrice: 20},
    {ticker: 'MCD', shares: 34, cost: 40, avgPrice: 49.3},
    {ticker: 'SCHD', shares: 0.5, cost: 40, avgPrice: 100.2},
    {ticker: 'V', shares: 12.4, cost: 40, avgPrice: 20.2}
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
    console.log('dialogdata', this.dialogData);
    console.log('stock', issue);
    
    this.dialogData = issue;
  }

  deleteIssue (id: number): void {
    console.log(id);
  }


}
