import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonSchemaService } from '../../_services/services';

@Component({
  selector: 'app-json-schema',
  templateUrl: './json-schema.component.html',
  styleUrls: ['./json-schema.component.css']
})
export class JsonSchemaComponent implements OnInit {

  jsonSchema: any;

  constructor(private route: ActivatedRoute, private jsonSchemaService: JsonSchemaService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.jsonSchemaService.getJsonSchemaByBatchId(params['id']).subscribe((data) => {
        if (data && data.length > 0) {
          this.jsonSchema = data[0].jsonSchema;
        }
      });
    });
  }

}
