import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {DataService} from '../../services/data.service';
import {StockService} from '../../services/stock.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-shares',
  templateUrl: './add-shares.component.html',
  styleUrls: ['./add-shares.component.css']
})
export class AddSharesComponent {

  constructor(public dialogRef: MatDialogRef<AddSharesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public stockService: StockService) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    // this.dataService.updateIssue(this.data); //stel
    this.stockService.addShares(this.data);
  }

}
