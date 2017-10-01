import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../_services/services';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

	alerts: Array<any>;

	constructor(private alertService:AlertService) { }

	ngOnInit() {
		this.alerts = this.alertService.listAlerts();
	}

	getStatusIcon(alertStatus) {
		switch(alertStatus){
			case "IN_PROGRESS":
				return "loop";
			case "ERROR":
				return "error";
			case "DONE":
				return "check_circle";
		}	
	}

	isInprogress(alertStatus) {
		return alertStatus === "IN_PROGRESS";
	}

}
