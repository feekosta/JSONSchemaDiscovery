import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';

import { User } from '../../_models/user';
import { JsonSchemaService } from "../../_services/services";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	currentUser: User;
	jsonSchemes: Array<any>;

	constructor(private jsonSchemaService:JsonSchemaService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.jsonSchemes = this.jsonSchemaService.listJsonSchemes();
    }

	ngOnInit() {
		console.log("usuário logado",this.currentUser);
	}

}