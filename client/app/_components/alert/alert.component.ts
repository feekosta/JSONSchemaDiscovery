import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../_services/services';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

	alerts: any;

	constructor(private alertService:AlertService) { }

	ngOnInit() {
		this.alertService.listAlerts().subscribe((data) => {
	        this.alerts = data;
        });
	}

	getStatusIcon(alertStatus) {
		switch(alertStatus){
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
