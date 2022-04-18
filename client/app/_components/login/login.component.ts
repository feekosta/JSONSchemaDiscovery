import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService, EventService, FeedbackService } from '../../_services/services';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  showPassword = false;
  returnUrl: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private eventService: EventService,
              private feedbackService: FeedbackService) { }

  emailFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(EMAIL_REGEX)
  ]);

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    if (this.model.email && this.model.password) {
      this.loading = true;
      this.authenticationService.login(this.model.email, this.model.password)
        .subscribe(
          data => {
            this.eventService.setIsLogged(true);
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.feedbackService.error(error.error.error);
            this.loading = false;
          }
        );
    }
  }

}

