import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../_services/services';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  message: any;

  constructor(private feedbackService: FeedbackService) { }

  ngOnInit() {
  	this.feedbackService.getMessage().subscribe(message => { this.message = message; });
  }

}
