import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AlertService } from '../../_services/services';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

	dataSource: AlertSource | null;
  	dataSubject = new BehaviorSubject<any[]>([]);
  	displayedColumns = ['status', 'dbUri', 'collectionName', 'date', 'actions'];

	constructor(private alertService:AlertService) { }

	ngOnInit() {
		this.alertService.listAlerts().subscribe({
			next: value => this.dataSubject.next(value)
		});
		if(this.dataSubject){
			this.dataSource = new AlertSource(this.dataSubject);
		}
	}

	getStatusIcon(alertStatus) {
		switch(alertStatus){
			case "ERROR":
				return "report_problem";
			case "DONE":
				return "check_circle";
		}	
	}

	getStatusColor(alertStatus) {
		switch(alertStatus){
			case "ERROR":
				return "warn";
			case "DONE":
				return "primary";
		}	
	}

	getStatusTooltip(alertStatus) {
		switch(alertStatus){
			case "ERROR":
				return "Não foi possível concluir a extração. Tente novamente.";
			case "DONE":
				return "Finalizado com sucesso";
		}		
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