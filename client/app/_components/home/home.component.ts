import { Component, OnInit } from '@angular/core';

import { User } from '../../_models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	currentUser: User;

	constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

	ngOnInit() {
		console.log("usuário logado",this.currentUser);
	}

}
