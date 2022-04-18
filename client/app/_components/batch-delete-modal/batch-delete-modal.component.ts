import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-batch-delete-modal',
  templateUrl: './batch-delete-modal.component.html',
  styleUrls: ['./batch-delete-modal.component.css']
})
export class BatchDeleteModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BatchDeleteModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
