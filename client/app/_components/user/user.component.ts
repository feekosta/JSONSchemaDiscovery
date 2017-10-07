import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/services';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  	user: any = {};

	constructor(private userService: UserService) { }

	ngOnInit() {
		this.userService.get().subscribe((data) => {
			if(data){
				this.user = data;
			}
		});
	}

}
