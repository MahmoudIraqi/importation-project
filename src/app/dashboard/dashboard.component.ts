import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {FormService} from '../services/form.service';
import {TranslateService} from "@ngx-translate/core";
import {distinctUntilChanged, filter} from "rxjs/operators";
import {InputService} from "../services/input.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  numberOFAllRequestObject = [
    {
      id: 'track',
      icon: 'flaticon-tracking',
      title: 'In Progress Requests',
      numberOfRequest: 0,
      active: false,
    },
    {
      id: 'draft',
      icon: 'flaticon-approval',
      title: 'Draft Requests',
      numberOfRequest: 0,
      active: false,
    },
    {
      id: 'approve',
      icon: 'flaticon-archive',
      title: 'Approved Requests',
      numberOfRequest: 0,
      active: false,
    },
    {
      id: 'total',
      icon: 'flaticon-archive',
      title: 'Total Requests',
      numberOfRequest: 0,
      active: false,
    }
  ];
  @ViewChild('count', {static: true}) numberCount: ElementRef;
  currentLang = this.translateService.currentLang ? this.translateService.currentLang : 'en';
  dataObject: any;

  colorList = ['<5', '20-24', '35-39', '50-54', '65-69', '≥85'];
  dataForBarChart;
  dataForPieCharts;

  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  isLoading: boolean = false;
  CompanyRoleID;
  constructor(private getService: FormService,
              private inputService: InputService,
              public translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.isLoading = true;

        this.inputService.getInput$().pipe(
          filter(x => x.type === 'currentLang'),
          distinctUntilChanged()
        ).subscribe(res => {
          this.currentLang = res.payload;
        });

        this.inputService.getInput$().pipe(
          filter(x => x.type === 'CompanyData'),
          distinctUntilChanged()
        ).subscribe(res => {
          this.CompanyRoleID = res.payload.CompanyRoleID;
        });

        this.getService.getCompanyPendingRequestsCount(this.CompanyRoleID).subscribe((res: any) => {
          this.numberOFAllRequestObject[0].numberOfRequest=res;
        });
        this.getService.getCompanyDraftRequestsCount(this.CompanyRoleID).subscribe((res: any) => {
          this.numberOFAllRequestObject[1].numberOfRequest=res;
        });
        this.getService.getCompanyApprovedRequestsCount(this.CompanyRoleID).subscribe((res: any) => {
          this.numberOFAllRequestObject[2].numberOfRequest=res;
        });
        this.getService.getTotalRequestsCount(this.CompanyRoleID).subscribe((res: any) => {
          this.numberOFAllRequestObject[3].numberOfRequest=res;
        });
        this.isLoading = false;
/*       this.getService.getDashboardData().subscribe((res: any) => {
       this.numberOFAllRequestObject.map(item => {
         item.numberOfRequest = res[item.id].data.reduce((a, b) => a + b.value, 0) >= 0 ? res[item.id].data.reduce((a, b) => a + b.value, 0) : 0;
         res[item.id].pieData.map((element, i) => {
           element.color = this.colorList[i];
         });
       });

       this.dataObject = res;

       this.numberOFAllRequestObject.map((x, i) => {
         this.counter(this.numberCount, 0, x.numberOfRequest, 5000, i);
       });

       this.isLoading = false;
       this.selectCharts('track', 0);
     }, error => this.handleError(error)); */
  }

  counter(id, start, end, duration, index) {
    let countValue,
      current = start,
      range = end - start,
      increment = end > start ? 1 : 0,
      step = Math.abs(Math.floor(duration / range)),
      timer = setInterval(() => {
        current += increment;
        this.numberOFAllRequestObject[index].numberOfRequest = current;
        if (current == end) {
          clearInterval(timer);
        }
      }, step);

  }

  selectCharts(whichType, index) {
    this.numberOFAllRequestObject.map(request => request.active = false);

    this.numberOFAllRequestObject[index].active = true;

    this.dataForBarChart = this.dataObject[whichType].data;
    this.dataForPieCharts = this.dataObject[whichType].pieData;
  }

  handleError(message) {
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = {msg: message};
    this.isLoading = false;
  }

  onClosedErrorAlert() {
    setTimeout(() => {
      this.alertErrorNotificationStatus = false;
    }, 2000);
  }
}
