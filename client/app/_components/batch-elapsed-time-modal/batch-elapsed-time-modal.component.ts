import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-batch-elapsed-time-modal',
  templateUrl: './batch-elapsed-time-modal.component.html',
  styleUrls: ['./batch-elapsed-time-modal.component.css']
})
export class BatchElapsedTimeModalComponent implements OnInit {

  stepOneElapsedTime: string;
  stepTwoDotOneElapsedTime: string;
  stepTwoDotTwoElapsedTime: string;
  stepThreeElapsedTime: string;
  stepFourElapsedTime: string;
  allStepsElapsedTime: string;

  constructor(public dialogRef: MatDialogRef<BatchElapsedTimeModalComponent>, @Inject(MAT_DIALOG_DATA) public batch: any) {}

  ngOnInit() {
    this.stepOneElapsedTime = this.getTimeDiff(this.batch.startDate, this.batch.extractionDate);

    switch (this.batch.reduceType) {
      case 'MAP_REDUCE':
        this.stepTwoDotOneElapsedTime = this.getTimeDiff(this.batch.extractionDate, this.batch.unorderedMapReduceDate);
        this.stepTwoDotTwoElapsedTime = this.getTimeDiff(this.batch.unorderedMapReduceDate, this.batch.orderedMapReduceDate);
        this.stepThreeElapsedTime = this.getTimeDiff(this.batch.orderedMapReduceDate, this.batch.unionDate);
        break;

      case 'AGGREGATE':
        this.stepTwoDotOneElapsedTime = this.getTimeDiff(this.batch.extractionDate, this.batch.unorderedAggregationDate);
        this.stepTwoDotTwoElapsedTime = this.getTimeDiff(this.batch.unorderedAggregationDate, this.batch.orderedAggregationDate);
        this.stepThreeElapsedTime = this.getTimeDiff(this.batch.orderedAggregationDate, this.batch.unionDate);
        break;

      case 'AGGREGATE_AND_MAP_REDUCE':
        this.stepTwoDotOneElapsedTime = this.getTimeDiff(this.batch.extractionDate, this.batch.unorderedAggregationDate);
        this.stepTwoDotTwoElapsedTime = this.getTimeDiff(this.batch.unorderedAggregationDate, this.batch.orderedMapReduceDate);
        this.stepThreeElapsedTime = this.getTimeDiff(this.batch.orderedMapReduceDate, this.batch.unionDate);
        break;
    }

    this.stepFourElapsedTime = this.getTimeDiff(this.batch.unionDate, this.batch.endDate);
    this.allStepsElapsedTime = this.getTimeDiff(this.batch.startDate, this.batch.endDate);
  }

  private getTimeDiff(date1: Date, date2: Date) {
    const ms = moment(date2).diff(moment(date1));
    const d = moment.duration(ms);
    return Math.floor(d.asHours()) + moment.utc(ms).format(':mm:ss:SSS');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
