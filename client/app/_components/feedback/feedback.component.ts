import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../_services/services';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  message: any;

  constructor(private feedbackService: FeedbackService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.feedbackService.getMessage().subscribe(message => {
      if (message) {
        this._snackBar.open(message.text, null, {
          horizontalPosition: 'start',
          verticalPosition: 'bottom',
          duration: 3000
        });
      }
    });
  }
}
