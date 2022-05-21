import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormService} from "../../services/form.service";
import {distinctUntilChanged, filter} from "rxjs/operators";
import {InputService} from "../../services/input.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesPerAdminAfterIntegrating } from 'src/utils/common-models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-draft-requests',
  templateUrl: './draft-requests.component.html',
  styleUrls: ['./draft-requests.component.scss']
})
export class DraftRequestsComponent implements OnInit {
  serviceId:number=0;
  serviceTypeId:number=0;
  serviceTypeName:string='';
  isLoading: boolean = false;
  alertNotificationStatus: boolean = false;
  alertNotification: any;
  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  draftList = {};
  CompanyRoleID;

  @ViewChild('deleteModal') modalDeletedTemplate: TemplateRef<any>;
  modalRef: BsModalRef;
  modalOptions: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    class: 'modal-xl packagingModal',
  };
  modalRequestId: any;

  constructor(private router: Router,
              public translateService: TranslateService,
              private getService: FormService,
              private modalService: BsModalService,
              private inputService: InputService,
              private route: ActivatedRoute,
              ) {
                this.route.params.subscribe(res => {
                  if (res) 
                  { this.serviceId=res.serviceId;
                    this.serviceTypeId=res.serviceTypeId;
                    this.serviceTypeName=res.serviceTypeName;
                  }
                });

  }



  ngOnInit(): void {
    this.inputService.getInput$().pipe(
      filter(x => x.type === 'CompanyData'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.CompanyRoleID = res.payload.CompanyRoleID;
    });

    this.isLoading = true;
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
            'BolNo',
            'type',
            'originalRequest',
            'CreatedBy',
            'createdDate',
            'action',
          ],
          tableBody: res,
        };
        this.isLoading = false;
      },
      (error) => this.handleError(error)
    );
  }

  openDeleteModal(request) {
    this.modalRef = this.modalService.show(this.modalDeletedTemplate, this.modalOptions);
    this.modalRequestId = request.requestId;
  }

  removeProduct() {
    this.isLoading = true;
    this.getService.deleteRequestDetails(this.modalRequestId).subscribe(res => {

      if (res) {
        this.isLoading = false;
        this.modalRef.hide();
        this.alertNotificationStatus = true;
        this.alertNotification = this.alertForSubmitRequest();
        this.onClosedErrorAlert();
        this.getDraftProductsList();

      }
    }, error => this.handleError(error));
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

  alertForSubmitRequest() {
    return {msg: 'You had a successful Delete'};
  }
  editCustomReleaseRequest(request)
  {
   // this.router.navigateByUrl(serviceId ? `${link}/${serviceId}/${serviceTypeId}/${serviceTypeName}` : link)
   // this.router.navigate([`/pages/cosmetics-product/inner/new-request/${Number(request.requestId)}`]);
     this.router.navigate([`/pages/cosmetics-product/inner/new-request/${Number(this.serviceId)}/${Number(this.serviceTypeId)}/${this.serviceTypeName}/${Number(request.requestId)}`]);
  }
  deleteRequest(request)
  {   
    this.getService.deleteRequestDetails(request.requestId).subscribe(res => {

      if (res) {
        this.draftList={};
        this.getDraftProductsList();
      }
    }, error => this.handleError(error));}
}
