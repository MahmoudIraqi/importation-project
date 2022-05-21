import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-draft-requests',
  templateUrl: './draft-requests.component.html',
  styleUrls: ['./draft-requests.component.scss']
})
export class DraftRequestsComponent implements OnInit {

  isLoading: boolean = false;
  alertNotificationStatus: boolean = false;
  alertNotification: any;
  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  draftList = {
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
