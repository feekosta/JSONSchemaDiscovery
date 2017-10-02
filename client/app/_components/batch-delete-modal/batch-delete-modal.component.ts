import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-batch-delete-modal',
  templateUrl: './batch-delete-modal.component.html',
  styleUrls: ['./batch-delete-modal.component.css']
})
export class BatchDeleteModalComponent implements OnInit {

  constructor(
    public dialogRef: MdDialogRef<BatchDeleteModalComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
