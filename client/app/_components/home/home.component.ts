import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import { MatDialog } from '@angular/material';

import { User } from '../../_models/user';
import { JsonSchemaService, FeedbackService } from "../../_services/services";
import { BatchDeleteModalComponent } from "../batch-delete-modal/batch-delete-modal.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	currentUser: User;
	batches: any;

	constructor(
		private jsonSchemaService:JsonSchemaService, 
		private dialog:MatDialog,
		private feedbackService: FeedbackService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.jsonSchemaService.listBatches().subscribe((data) => {
	        this.batches = data;
        });
    }

	ngOnInit() {
		console.log("usuário logado",this.currentUser);
	}

	delete(batchId) {
		const deleteModal = this.dialog.open(BatchDeleteModalComponent, {
			width: '250px',
			data: { 'batchId': batchId }
		});
		deleteModal.afterClosed().subscribe((result) => {
			if(result){
				this.jsonSchemaService.deleteBatch(batchId).subscribe((data) => {
					this.feedbackService.success("Deletado");
					this.jsonSchemaService.listBatches().subscribe((data) => {
				        this.batches = data;
			        });
				});
			}
		});
	}

}