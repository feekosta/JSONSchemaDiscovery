import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { AlertService, FeedbackService } from '../../_services/services';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  dataSource: AlertSource | null;
  dataSubject = new BehaviorSubject<any[]>([]);
  displayedColumns = ['status', 'dbUri', 'collectionName', 'date', 'actions'];

  constructor(private alertService: AlertService, private feedbackService: FeedbackService) { }

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.alertService.listAlerts().subscribe({
      next: value => this.dataSubject.next(value)
    });
    if (this.dataSubject) {
      this.dataSource = new AlertSource(this.dataSubject);
    }
  }

  getStatusIcon(alertStatus) {
    switch (alertStatus) {
      case 'ERROR':
        return 'report_problem';
      case 'DONE':
        return 'check_circle';
    }
  }

  getStatusColor(alertStatus) {
    switch (alertStatus) {
      case 'ERROR':
        return 'warn';
      case 'DONE':
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
        return 'Não há documentos na coleção informada. Verifique a coleção informada e tente novamente.';
      case 'LOADING_DOCUMENTS_ERROR':
        return 'Houve um problema durante a leitura dos documentos. Tente novamente.';
      default:
        return 'Não foi possível concluir a extração. Tente novamente.';
    }
  }

  delete(alertId) {
    this.alertService.deleteAlert(alertId).subscribe(() => {
      this.feedbackService.success('Deletado');
      this.loadAlerts();
    });
  }

}

export class AlertSource extends DataSource<any[]> {

  constructor(private subject: BehaviorSubject<any[]>) {
    super ();
  }

  connect (): Observable<any[]> {
    return this.subject.asObservable();
  }

  disconnect (  ): void {
  }

}
