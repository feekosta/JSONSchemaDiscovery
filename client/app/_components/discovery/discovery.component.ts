import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseParam } from '../../_params/params';
import { JsonSchemaService, FeedbackService } from '../../_services/services';

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.component.html',
  styleUrls: ['./discovery.component.css']
})
export class DiscoveryComponent implements OnInit {

  loading = false;
  isLinear = false;
  formGroup: FormGroup;
  model: DatabaseParam;
  authMechanisms: Array<string>;

  constructor(private _formBuilder: FormBuilder,
              private router: Router,
              private jsonSchemaService: JsonSchemaService,
              private feedbackService: FeedbackService) {
      this.model = new DatabaseParam();
      this.model.port = '27017';
      this.authMechanisms = [
        'DEFAULT', 'GSSAPI', 'PLAIN', 'MONGODB-X509', 'SCRAM-SHA-1', 'MONGODB-CR'
      ];
    }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      formCtrl: ['', Validators.required]
    });
  }

  discovery() {
    this.loading = true;
    this.jsonSchemaService.discovery(this.model)
      .subscribe(
        data => {
          this.feedbackService.success('Processo iniciado', true);
          this.router.navigate(['/']);
        },
        error => {
          this.feedbackService.error(error.error.error);
          this.loading = false;
        }
      );
  }

}
