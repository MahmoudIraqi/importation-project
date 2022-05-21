import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {routerTransitionSlide} from 'src/app/animation/routable.animations';
import {FormService} from '../services/form.service';
import {distinctUntilChanged, filter} from 'rxjs/operators';
import {InputService} from '../services/input.service';
import {interval} from 'rxjs';

@Component({
  selector: 'app-home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.scss'],
  animations: [
    routerTransitionSlide
  ]
})
export class HomeContainerComponent implements OnInit {
  formData = {
    ports: [],
    importReason: [],
    companyProfile: [],
    ingredient: [],
    function: [],
    packagingType: [],
    rowMaterial: [],
    productManufacture: {},
    releaseType: [],
    countries: [],
    currencies: [],
    unitOfMeasure: [],
    applicantList: [],
    itemTypeList: [],
    importReasonList: [],
    rawMaterialList: [],
  };
  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  isLoading: boolean = false;
  companyProfileId: any;
  username;
  unseenCount;
  currentLang;

  constructor(private inputService: InputService, private getService: FormService) {
    // interval(10000).subscribe(x => { // will execute every 30 seconds
    //   this.getNotificationNumber();
    // });
  }

  async ngOnInit(): Promise<any> {
 
    this.isLoading = true;
    this.inputService.getInput$().pipe(
      filter(x => x.type === 'CompanyData'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.companyProfileId = res.payload.companyId;
      this.username = res.payload.CompanyName;
    });

    await this.getService.getAllPortsLookUp().subscribe((res: any) => {
      if (res) {
        this.formData.ports = res;
      }
    }), error => this.handleError(error);
    await this.getService.getAllInvoiceItemTypes().subscribe((res: any) => {
      if (res) {
        this.formData.itemTypeList = res;
      }
    }), error => this.handleError(error);
    await this.getService.getAllImportReason().subscribe((res: any) => {
      if (res) {
        this.formData.importReason = res;
      }
    }), error => this.handleError(error);
    await this.getService.getAllImportReason().subscribe((res: any) => {
      if (res) {
        this.formData.importReasonList = res;
      }
    }), error => this.handleError(error);
    await this.getService.getCompanyProfiles().subscribe((res: any) => {
      if (res) {
        this.formData.companyProfile = res;
      }
    }), error => this.handleError(error);
    await this.getService.getAllIngredient().subscribe((res: any) => {
      if (res) {
        this.formData.ingredient = res;
        this.formData.rawMaterialList = res;
      }
    }), error => this.handleError(error);
    await this.getService.getAllPackagingList().subscribe((res: any) => {
      if (res) {
        this.formData.packagingType = res;
      }
    }), error => this.handleError(error);
    await this.getService.getAllSrcRowMaterial().subscribe((res: any) => {
      if (res) {
        this.formData.rowMaterial = res;
      }
    }), error => this.handleError(error);
    // await this.getService.getAllProductManufacture().subscribe((res: any) => {
    //   if (res) {
    //     this.formData.productManufacture = res;
    //   }
    // }), error => this.handleError(error);
    await this.getService.getAllReleaseType().subscribe((res: any) => {
      if (res) {
        this.formData.releaseType = res;
      }
    }), error => this.handleError(error);
    await this.getService.getSharedCountries().subscribe((res: any) => {
      if (res) {
        this.formData.countries = res;
        this.formData.productManufacture = res;
      }
    }), error => this.handleError(error);
    await this.getService.getSharedCurrencies().subscribe((res: any) => {
      if (res) {
        this.formData.currencies = res;
      }
    }), error => this.handleError(error);
    await this.getService.getAllUnitOfMeasure().subscribe((res: any) => {
      if (res) {
        this.formData.unitOfMeasure = res;
      }
    }), error => this.handleError(error);

    await this.inputService.publish({type: 'allLookups', payload: this.formData});

    await this.inputService.getInput$().pipe(
      filter(x => x.type === 'notificationUnreadCount'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.unseenCount = res.payload.filter(x => !x.f_seen).map(list => list).length;
    });

    await this.getService.getAllDepartmentsInSys().subscribe((res: any) => {
      if (res) {
        this.inputService.publish({type: 'departments', payload: res});
      }

      this.isLoading = false;
    }), error => this.handleError(error);
    console.log('formdate', this.formData)
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  handleError(error) {
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = {msg: error};
    this.isLoading = false;
  }

  onClosedErrorAlert() {
    setTimeout(() => {
      this.alertErrorNotificationStatus = false;
    }, 10000);
  }

  // getNotificationNumber() {
  //   this.getService.getNotificationLogsList().subscribe((res: any) => {
  //     this.unseenCount = res.filter(x => !x.f_seen).map(list => list).length;
  //   }, error => this.handleError(error));
  // }

  changeLang(event) {
    this.currentLang = event;

    this.inputService.publish({type: 'currentLang', payload: this.currentLang})
  }
}
