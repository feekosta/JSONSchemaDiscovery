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
  	displayedColumns = ['type', 'dbUri', 'collectionName', 'actions', 'date'];

	constructor(private alertService:AlertService) { }

	ngOnInit() {
		this.alertService.listAlerts().subscribe({
			next: value => this.dataSubject.next(value)
		});
		this.dataSource = new AlertSource(this.dataSubject);
	}

	getStatusIcon(alertStatus) {
		switch(alertStatus){
			case "ERROR":
				return "error";
			case "DONE":
				return "check_circle";
		}	
	}

	getStatusTooltip(alertStatus) {
		switch(alertStatus){
			case "ERROR":
				return "Houve algum erro. Tente novamente.";
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