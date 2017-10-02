import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonSchemaService } from '../../_services/services';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {

	batch: any;

	constructor(
		private route: ActivatedRoute, 
		private jsonSchemaService:JsonSchemaService) { }

	ngOnInit() {
		this.route.params.subscribe((params) => {
			this.jsonSchemaService.getBatchById(params['id']).subscribe((data) => {
				this.batch = data;
			});
		});
	}

}
