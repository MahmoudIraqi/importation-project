import {DecimalPipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {FormService} from 'src/app/services/form.service';
import {InputService} from 'src/app/services/input.service';

@Component({
  selector: 'app-premix-list',
  templateUrl: './premix-list.component.html',
  styleUrls: ['./premix-list.component.scss'],
})
export class PremixListComponent implements OnInit {
  premixList;
  alertErrorNotificationStatus = false;
  alertErrorNotification: any;
  isLoading = false;
  currentLang = this.translateService.currentLang ? this.translateService.currentLang : 'en';

  constructor(
    private fb: FormBuilder,
    private numberTransform: DecimalPipe,
    private router: Router,
    private route: ActivatedRoute,
    private inputService: InputService,
    public translateService: TranslateService,
    private getService: FormService
  ) {
  }

  ngOnInit(): void {
    this.isLoading = false;
    this.listPremixes();
  }

  listPremixes(): void {
    this.getService.getPremixList().subscribe(
      (res: any) => {
        if (res) {
          this.premixList = {
            tableHeader: [
              'id',
              'name',
              'notificationNo',
              'originName',
              'supplierName',
              'action',
            ],
            tableBody: res,
          };
          this.isLoading = false;
        }
      },
      (error) => this.handleError(error)
    );
  }

  handleError(message): void {
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = {msg: message};
    this.isLoading = false;
  }

  onClosedErrorAlert(): void {
    setTimeout(() => {
      this.alertErrorNotificationStatus = false;
    }, 2000);
  }

  /* Remove premix button Functionality */
  removePremix(premix): void {
    this.getService.removePremix(premix.id).subscribe(
      (res: any) => {
      },
      (error) => this.handleError(error)
    );
    this.ngOnInit();
  }

  /* Edit premix button functionality |direct to addNewPremix component with ID in params */
  editPremix(id): void {
    this.router.navigate([
      `/pages/cosmetics-product/inner/createOrEdit-premix/${id}`,
    ]);
  }

  /* View premix button functionality */
  viewPremix(id): void {
    this.router.navigate(
      [`/pages/cosmetics-product/inner/createOrEdit-premix/${id}`],
      {queryParams: {view: 'true'}}
    );
  }
}
