import { Component } from '@angular/core';
import * as moment from 'moment';
import 'moment/min/locales';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() {
    moment.locale('pt-br');
  }

}
