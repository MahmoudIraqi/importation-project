import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { InputService } from '../../../services/input.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-draft-import-requests',
  templateUrl: './draft-import-requests.component.html',
  styleUrls: ['./draft-import-requests.component.scss'],
})
export class DraftImportRequestsComponent implements OnInit {
  serviceId;
  serviceTypeId;
  serviceTypeName;
  isLoading: boolean = false;
  alertNotificationStatus: boolean = false;
  alertNotification: any;
  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  draftList = {};
  companyProfileId;

  @ViewChild('deleteModal') modalDeletedTemplate: TemplateRef<any>;
  modalRef: BsModalRef;
  modalOptions: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    class: 'modal-xl packagingModal',
  };
  modalRequestId: any;

  constructor(
    private fb: FormBuilder,
    private number: DecimalPipe,
    private router: Router,
    private route: ActivatedRoute,
    public translateService: TranslateService,
    private getService: FormService,
    private modalService: BsModalService,
    private inputService: InputService
  ) {
    this.route.params.subscribe(res => {
      if (res)
      { this.serviceId=res.serviceId;
        this.serviceTypeId=res.serviceTypeId;
        this.serviceTypeName=res.serviceTypeName;
      }
    });
  }
  CompanyRoleID;
  ngOnInit(): void {
    this.inputService.getInput$().pipe(
      filter(x => x.type === 'CompanyData'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.CompanyRoleID = res.payload.CompanyRoleID;
    });

    this.isLoading = true;
    this.getDraftProductsList();
    this.getDraftProductsList();
  }
  getDraftProductsList() {
    const serviceObj = {serviceId: this.serviceId,
      serviceTypeId: this.serviceTypeId
    };
    this.getService.postImportedDraftRequestForView(serviceObj).subscribe(
      (res: any) => {

        this.draftList = {
          tableHeader: [
            'requestid',
            'CreatedBy',
            'SubmissionDate',
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


  openDeleteModal(event) {
    this.modalRef = this.modalService.show(
      this.modalDeletedTemplate,
      this.modalOptions
    );
    this.modalRequestId = event.requestId;
  }

  removeProduct() {
    this.isLoading = true;
    this.getService.deleteRequestDetails(this.modalRequestId).subscribe(
      (res) => {
        if (res) {
          this.isLoading = false;
          this.modalRef.hide();

          this.alertNotificationStatus = true;
          this.alertNotification = this.alertForSubmitRequest();
          this.onClosedErrorAlert();

          this.getDraftProductsList();
        }
      },
      (error) => this.handleError(error)
    );
  }

  handleError(message) {
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = { msg: message };
    this.isLoading = false;
  }

  onClosedErrorAlert() {
    setTimeout(() => {
      this.alertErrorNotificationStatus = false;
    }, 2000);
  }

  alertForSubmitRequest() {
    return { msg: 'You had a successful Delete' };
  }

  //here is the function needed to update the selected draft row
  updatedraft(event) {
    this.router.navigate([
      `/pages/cosmetics-product/inner/newImportedrequest/${Number(this.serviceId)}/${Number(this.serviceTypeId)}/${this.serviceTypeName}/${event.requestId}`,
    ]);
    // this.getService.GetSaveSubmitData(event.requestId).subscribe(data=>{
    // },error=>{
    //   this.handleError(error)
    // })
  }
}
