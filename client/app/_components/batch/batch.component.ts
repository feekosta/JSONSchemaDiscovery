import * as FileSaver from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BatchElapsedTimeModalComponent } from '../batch-elapsed-time-modal/batch-elapsed-time-modal.component';
import { JsonSchemaService } from '../../_services/services';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {

  batch: any;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private jsonSchemaService: JsonSchemaService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.jsonSchemaService.getBatchById(params['id']).subscribe((data) => {
        this.batch = data;
      });
    });
  }

  download() {
    this.jsonSchemaService.getJsonSchemaByBatchId(this.batch._id).subscribe((data) => {
      if (data && data.length > 0) {
        const jsonSchema = data[0].jsonSchema;
        const fileName = `${this.batch.collectionName}.json`;
        const fileToSave = new Blob([JSON.stringify(jsonSchema)], {
          type: 'application/json'
          });
        FileSaver.saveAs(fileToSave, fileName);
      }
    });
  }

  openElapsedTimeModal() {
    const batchElapsedTimeModal = this.dialog.open(BatchElapsedTimeModalComponent, {
      height: '500px',
      width: '500px',
      data: this.batch
    });
    batchElapsedTimeModal.afterClosed().subscribe((result) => {});
  }

}
