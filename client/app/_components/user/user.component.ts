import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/services';
import {User} from '../../_services/user/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.get().subscribe((data) => {
      if (data) {
        this.user = data;
      }
    });
  }

}
