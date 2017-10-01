import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, EventService } from "../../_services/services";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	showNavBar: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService, 
    private eventService: EventService) {
    this.eventService.showNavBarEmitter.subscribe((mode)=>{
        // mode will be null the first time it is created, so you need to igonore it when null
        if (mode !== null) {
          this.showNavBar = mode;
        }
    });
  }

  ngOnInit() {
  }

  logout(){
    this.authenticationService.logout();
    this.showNavBar = false;
    this.router.navigate(["/"]);
    this.router.navigate(["/login"]);
  }

}
