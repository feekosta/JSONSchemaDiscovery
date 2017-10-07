import { Component, OnInit } from '@angular/core';
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
		private dialog:MatDialog,
		private jsonSchemaService:JsonSchemaService, 
		private feedbackService: FeedbackService) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.jsonSchemaService.listBatches().subscribe((data) => {
	        this.batches = data;
        });
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

	getStatusIcon(batchStatus) {
		switch(batchStatus){
			case "ERROR":
				return "report_problem";
			case "DONE":
				return "check_circle";
		}	
	}

	getStatusColor(batchStatus) {
		switch(batchStatus){
			case "ERROR":
				return "warn";
			default:
				return "primary";
		}	
	}

	getStatusTooltip(batchStatus) {
		switch(batchStatus){
			case "ERROR":
				return "Não foi possível concluir a extração. Tente novamente.";
			case "DONE":
				return "Finalizado com sucesso.";
			default:
				return "Em andamento.";
		}		
	}


}