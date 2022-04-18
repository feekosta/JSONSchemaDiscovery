import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../_models/user';
import { JsonSchemaService, FeedbackService } from '../../_services/services';
import { BatchDeleteModalComponent } from '../batch-delete-modal/batch-delete-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentUser: User;
  batches: any;

  constructor(private dialog: MatDialog, private jsonSchemaService: JsonSchemaService, private feedbackService: FeedbackService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.jsonSchemaService.listBatches().subscribe((batches) => {
      this.batches = batches;
    });
  }

  delete(batchId) {
    const deleteModal = this.dialog.open(BatchDeleteModalComponent, {
      width: '250px',
      data: { 'batchId': batchId }
    });
    deleteModal.afterClosed().subscribe((result) => {
      if (result) {
        this.jsonSchemaService.deleteBatch(batchId).subscribe(() => {
          this.feedbackService.success('Deletado');
          this.jsonSchemaService.listBatches().subscribe((batches) => {
            this.batches = batches;
          });
        });
      }
    });
  }

  getStatusIcon(batchStatus) {
    switch (batchStatus) {
      case 'ERROR':
        return 'report_problem';
      case 'DONE':
        return 'check_circle';
    }
  }

  getStatusColor(batchStatus) {
    switch (batchStatus) {
      case 'ERROR':
        return 'warn';
      default:
        return 'primary';
    }
  }

  getTypeTooltip(alertType) {
    switch (alertType) {
      case 'DONE':
        return 'Finalizado com sucesso';
      case 'DATABASE_CONNECTION_ERROR':
        return 'Não foi possível conectar ao banco de dados. Verifique o endereço informado e tente novamente.';
      case 'EMPTY_COLLECTION_ERROR':
        return 'Não há documentos na coleção informada. Verifique a mesma e tente novamente.';
      case 'LOADING_DOCUMENTS_ERROR':
        return 'Houve um problema durante a leitura dos documentos. Tente novamente.';
      default:
        return 'Não foi possível concluir a extração. Tente novamente.';
    }
  }

}
