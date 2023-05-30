import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Stock } from '../models/stock';

@Injectable({
  providedIn: 'root'
})
export class PieChartRefreshService {

  private notifySubject: Subject<Stock[]> = new Subject<Stock[]>();
  public notify$ = this.notifySubject.asObservable();

  constructor() { }

  notifyChild(changedStocks:Stock[]) {
    this.notifySubject.next(changedStocks);
  }
}
