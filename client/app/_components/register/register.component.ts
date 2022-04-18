import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, FeedbackService, RegistrationService } from '../../_services/services';

const EMAIL_REGEX = /^[a-zA-Z\d.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z\d-]+(?:\.[a-zA-Z\d-]+)*$/;

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};
    loading = false;
    showPassword = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private registrationService: RegistrationService,
              private feedbackService: FeedbackService) { }

  emailFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(EMAIL_REGEX)
  ]);

  ngOnInit() {
  }

  register() {
    if (this.model.email && this.model.password && this.model.username) {
      this.loading = true;
      this.registrationService.register(this.model)
        .subscribe(
          user => {
            this.authenticationService.login(this.model.email, this.model.password)
              .subscribe(
                data => {
                  this.feedbackService.success('Bem Vindo', true);
                  this.router.navigate(['/']);
                }
              );
          },
          error => {
            this.feedbackService.error(error.error.error);
            this.loading = false;
          }
        );
    }
  }

}
