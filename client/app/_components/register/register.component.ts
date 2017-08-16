import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, RegistrationService, AuthenticationService } from '../../_services/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	model: any = {};
    loading = false;

	constructor(
		private router: Router,
		private registrationService: RegistrationService,
		private authenticationService: AuthenticationService,
		private alertService: AlertService) { }

	ngOnInit() {
	}

	register() {
		this.loading = true;
		this.registrationService.register(this.model)
			.subscribe(
				data => { 
					this.authenticationService.login(this.model.email, this.model.password)
						.subscribe(
							data => { 
								this.alertService.success('Bem Vindo', true);
								this.router.navigate(['/']);
							}
						);
				},
				error => {
					this.alertService.error(error.json().error);
					this.loading = false;
				}
			);
	}

}
