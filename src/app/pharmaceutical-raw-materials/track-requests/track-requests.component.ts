import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-track-requests',
  templateUrl: './track-requests.component.html',
  styleUrls: ['./track-requests.component.scss']
})
export class TrackRequestsComponent implements OnInit {
  isLoading: boolean = false;
  alertNotificationStatus: boolean = false;
  alertNotification: any;
  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  trackList = {
    tableHeader: ['name', 'type', 'companyName', 'companyCountry', 'requestType', 'requestStatus', 'submissionDate', 'action'],
    tableBody: []
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  onClosedErrorAlert() {
    setTimeout(() => {
      this.alertErrorNotificationStatus = false;
    }, 2000);
  }
}
