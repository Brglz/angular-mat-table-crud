import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {DataService} from '../../services/data.service';
import {StockService} from '../../services/stock.service';


@Component({
  selector: 'app-delete.dialog',
  templateUrl: '../../dialogs/delete/delete.dialog.html',
  styleUrls: ['../../dialogs/delete/delete.dialog.css']
})
export class DeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: DataService, private stockService: StockService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    // this.dataService.deleteIssue(this.data.id); //stel
    this.stockService.deleteIssue(this.data.ticker)
  }
}
