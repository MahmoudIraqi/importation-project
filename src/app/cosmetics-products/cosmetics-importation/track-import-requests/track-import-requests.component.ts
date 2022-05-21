import { Component, OnInit, ViewChild } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { TranslateService } from '@ngx-translate/core';
import { InputService } from '../../../services/input.service';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { FormBuilder } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-track-import-requests',
  templateUrl: './track-import-requests.component.html',
  styleUrls: ['./track-import-requests.component.scss'],
})
export class TrackImportRequestsComponent implements OnInit {
  serviceId;
  serviceTypeId;
  serviceTypeName;
  isLoading: boolean = false;
  alertNotificationStatus: boolean = false;
  alertNotification: any;
  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  currentLang = this.translateService.currentLang
    ? this.translateService.currentLang
    : 'en';
  companyProfileId;
  importedtrackList = {};
  importedapprovedList = {};
  importedrejectedList = {};
  @ViewChild('formTabs', { static: false }) formTabs: TabsetComponent;

  constructor(
    private fb: FormBuilder,
    private number: DecimalPipe,
    private router: Router,
    private route: ActivatedRoute,
    private getService: FormService,
    public translateService: TranslateService,
    private inputService: InputService
  ) {
    this.route.params.subscribe((res) => {
      this.serviceId = res.serviceId;
      this.serviceTypeId = res.serviceTypeId;
      this.serviceTypeName = ' ' + res.serviceTypeName;
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.inputService
      .getInput$()
      .pipe(
        filter((x) => x.type === 'CompanyData'),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.companyProfileId = res.payload.companyId;
        this.serviceId = res.serviceId;
        this.serviceTypeId = res.serviceTypeId;
        this.serviceTypeName = ' ' + res.serviceTypeName;
      });

    this.inputService
      .getInput$()
      .pipe(
        filter((x) => x.type === 'currentLang'),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.currentLang = res.payload;
      });

    this.setActivatedTab({ target: { id: 'inProgress' } });
  }

  setActivatedTab(event) {
    switch (event.target.id.split('-')[0]) {
      case 'inProgress':
        this.getTrackProductsList();
        break;
      case 'approvedRequest':
        this.getApprovedRequestsList();
        break;
      case 'rejectedRequests':
        this.getRejectedRequestsList();
        break;
      default:
        return;
    }

    this.isLoading = false;
  }

  getTrackProductsList() {
    const body = { serviceId: 1, serviceTypeId: 1 };
    // const x={serviceTypeId:this.serviceTypeId, companyId: this.companyProfileId,companyProfileId: 0 }
    this.getService.postImportedPendingRequestForView(body).subscribe(
      (res: any) => {
        this.importedtrackList = {
          tableHeader: [
            'requestId',
            'createdBy',
            'submissionDate',
            // 'companyName',
            // 'companyCountry',
            'status',
            'action',
          ],
          tableBody: res,
        };
        this.isLoading = false;
      },
      (error) => this.handleError(error)
    );
  }

  getApprovedRequestsList() {
    const body = { serviceId: 1, serviceTypeId: 1 };

    this.getService.postImportedApprovedRequestForView(body).subscribe(
      (res: any) => {
        this.importedapprovedList = {
          tableHeader: [
            'requestId',
            'createdBy',
            'submissionDate',
            'approvalDate',
            'approvalNumber',
            // 'companyName',
            // 'companyCountry',
            'status',

            'action',
          ],
          tableBody: res,
        };
        this.isLoading = false;
      },
      (error) => this.handleError(error)
    );
  }

  getRejectedRequestsList() {
    const body = { serviceId: 1, serviceTypeId: 1 };

    this.getService.postImportedRejectedRequestForView(body).subscribe(
      (res: any) => {
        this.importedrejectedList = {
          tableHeader: [
            'requestId',
            'createdBy',
            'submissionDate',
            // 'companyName',
            // 'companyCountry',
            'status',
            'action',
          ],
          tableBody: res,
        };
        this.isLoading = false;
      },
      (error) => this.handleError(error)
    );
  }

  onClosedErrorAlert() {
    setTimeout(() => {
      this.alertErrorNotificationStatus = false;
    }, 2000);
  }

  handleError(message) {
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = { msg: message };
    this.isLoading = false;
  }
}
