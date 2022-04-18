import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, EventService, AlertService } from '../../_services/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLogged = false;
  alertsCount: number;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private eventService: EventService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.eventService.isLoggedEmitter.subscribe((mode) => {
        if (mode !== null) {
          this.isLogged = mode;
        }
        if (this.isLogged) {
          this.alertService.countAlerts().subscribe((count) => {
            this.alertsCount = count;
          });
        }
    });
  }

  logout() {
    this.authenticationService.logout();
    this.isLogged = false;
    this.router.navigate(['/']);
    this.router.navigate(['/login']);
  }

}
