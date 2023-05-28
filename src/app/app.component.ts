import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from './services/data.service';
import {StockService} from './services/stock.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Issue} from './models/issue';
import {DataSource} from '@angular/cdk/collections';
import {AddDialogComponent} from './dialogs/add/add.dialog.component';
import {EditDialogComponent} from './dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from './dialogs/delete/delete.dialog.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { Stock } from './models/stock';
import { AddSharesComponent } from './dialogs/add-shares/add-shares.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  displayedColumns = ['ticker', 'shares', 'cost', 'avgPrice', 'actions'];
  // exampleDatabase: DataService | null;//stel
  exampleDatabase: StockService;
  dataSource: ExampleDataSource | null;
  index: number;
  id: string;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: DataService, private stockService: StockService) {}

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: {issue: Stock }//stel
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        // this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());//stel
        this.exampleDatabase.dataChange.value.push(this.stockService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, ticker: string, shares: number, cost: number, avgPrice: number) {
    this.id = ticker;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {ticker: ticker, shares: shares, cost: cost, avgPrice: avgPrice}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.ticker === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.exampleDatabase.dataChange.value[foundIndex] = this.stockService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, ticker: string, shares: number, cost: number, avgPrice: number) {
    this.index = i;
    this.id = ticker;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {ticker: ticker, shares: shares, cost: cost, avgPrice: avgPrice}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.ticker === this.id);
        // for delete we use splice in order to remove single object from DataService
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  addShares(i: number, ticker: string, shares: number, cost: number, avgPrice: number) {
    this.index = i;
    this.id = ticker;
    console.log('initial data:', {ticker: ticker, shares: shares, cost: cost, avgPrice: avgPrice});
    
    const dialogRef = this.dialog.open(AddSharesComponent, {
      data: {ticker: ticker, shares: shares, cost: cost, avgPrice: avgPrice}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.ticker === this.id);
        console.log('foindindex', foundIndex);
        
        // Then you update that record using data from dialogData (values you enetered)
        const currentStock = this.exampleDatabase.dataChange.value[foundIndex];
        const newStockData:Stock =  this.stockService.getDialogData();

        const newShares = currentStock.shares + Number(newStockData.shares);
        const newCost = currentStock.cost + (newStockData.avgPrice * Number(newStockData.shares));
        const newAvgPrice = (currentStock.cost + newCost) / newShares;
        console.log('shares',newShares);
        console.log('cost', newCost);
        console.log('newAvgPrice', newAvgPrice);
        
    
        const updatedStock:Stock = {
          ticker: currentStock.ticker, 
          shares: newShares,
          cost: newCost,
          avgPrice: newAvgPrice
      }
      
      //avg= 20 share =2 cost= 40
      //avg= 20 share =2 cost= 40
      //avg 20 share 4 cost 80 
        console.log('currentStock', currentStock);
        console.log('newStockData', newStockData);
        
        this.exampleDatabase.dataChange.value[foundIndex] = updatedStock;
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    this.paginator._changePageSize(this.paginator.pageSize);
  }


  /*   // If you don't need a filter or a pagination this can be simplified, you just use code from else block
    // OLD METHOD:
    // if there's a paginator active we're using it for refresh
    if (this.dataSource._paginator.hasNextPage()) {
      this.dataSource._paginator.nextPage();
      this.dataSource._paginator.previousPage();
      // in case we're on last page this if will tick
    } else if (this.dataSource._paginator.hasPreviousPage()) {
      this.dataSource._paginator.previousPage();
      this.dataSource._paginator.nextPage();
      // in all other cases including active filter we do it like this
    } else {
      this.dataSource.filter = '';
      this.dataSource.filter = this.filter.nativeElement.value;
    }*/



  public loadData() {
    this.exampleDatabase = new StockService();
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    console.log("data", this.dataSource);
    console.log("data", this.exampleDatabase);
    
    fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }
}

export class ExampleDataSource extends DataSource<Stock> { //stel
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Stock[] = [];
  renderedData: Stock[] = [];

  constructor(public _exampleDatabase: StockService,//stel
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Stock[]> {//stel
    // Listen for any changes in the base data, sorting, filtering, or pagination
    console.log('OPA',this._exampleDatabase);
    
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllIssues();


    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this._exampleDatabase.data.slice().filter((issue: Stock) => {//stel
          const searchStr = (issue.ticker).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        console.log('hahaha',this.renderedData);
        
        return this.renderedData;
      }
    ));
  }

  disconnect() {}


  /** Returns a sorted copy of the database data. */
  sortData(data: Stock[]): Stock[] {//stel
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.ticker, b.ticker]; break;
        case 'title': [propertyA, propertyB] = [a.shares, b.shares]; break;
        case 'state': [propertyA, propertyB] = [a.cost, b.cost]; break;
        case 'url': [propertyA, propertyB] = [a.avgPrice, b.avgPrice]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
