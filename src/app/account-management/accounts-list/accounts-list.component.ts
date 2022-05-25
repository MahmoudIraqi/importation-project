import {DecimalPipe} from '@angular/common';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {TabsetComponent} from 'ngx-bootstrap/tabs';
import {FormService} from 'src/app/services/form.service';
import {InputService} from 'src/app/services/input.service';
import {distinctUntilChanged, filter} from "rxjs/operators";

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss'],
})
export class AccountsListComponent implements OnInit {
  @ViewChild('addRoleUserModal') addUserInCompanyProfile: TemplateRef<any>;
  @ViewChild('addServicesForSpecificUser') addServicesForSpecificUserInCompanyProfile: TemplateRef<any>;
  modalRef: BsModalRef;
  modalServiceRef: BsModalRef;
  modalOptions: ModalOptions = {backdrop: 'static', keyboard: false, class: 'modal-xl packagingModal'};
  companyForm: FormGroup;
  UserRoleForm: FormGroup;
  AddRoles: FormGroup;
  addUserForm: FormGroup;
  AllRoles = [];
  AllServiceList: any;
  usersList;
  companyTypes: any;
  alertErrorNotificationStatus = false;
  alertErrorNotification: any;
  isLoading = false;
  currentLang = this.translateService.currentLang ? this.translateService.currentLang : 'en';
  alertSuccessNotificationStatus = false;
  alertSuccessNotification: any;
  serviceList: any[];
  sentServices = [];
  selectedUser: any;
  selectedService: any[] = [];
  mainUserStatus = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private inputService: InputService,
              public translateService: TranslateService,
              private getService: FormService,
              private modalService: BsModalService) {
    this.getFormAsStarting('', '');
    this.getAddUserFormAsStarting('', '');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.GetAllCompanyInfo();
    this.GetCompanyTypes();
    this.GetCompanyRoles();
    this.GetServices();
    this.AddRoles = this.fb.group({
      Roles: [null, Validators.required],
    });

    this.UserRoleForm = this.fb.group({
      Roles: [null, Validators.required],
    });
    this.companyForm.disable();

    this.inputService.getInput$().pipe(
      filter(x => x.type === 'CompanyData'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.mainUserStatus = res.payload.mainUser;
    });
    this.isLoading = false;
  }

  getFormAsStarting(data, fromWhere): void {
    if (data) {
    } else {
      this.companyForm = this.fb.group({
        id: 0,
        companyName: this.fb.control(''),
        companyAddress: this.fb.control(''),
        companyPhone: this.fb.control(''),
        companyEmail: this.fb.control(''),
      });
    }
  }

  getAddUserFormAsStarting(data, fromWhere): void {
    if (data) {
    } else {
      this.addUserForm = this.fb.group({
        username: this.fb.control('', Validators.required),
        password: this.fb.control('', Validators.required),
        ip: this.fb.control('')
      });
    }
  }

  handleError(message): void {
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = {msg: message};
    this.isLoading = false;
  }

  handleSuccess(message): void {
    this.alertSuccessNotificationStatus = true;
    this.alertSuccessNotification = {msg: message};
    this.isLoading = false;
  }

  onClosedErrorAlert(): void {
    setTimeout(() => {
      this.alertErrorNotificationStatus = false;
    }, 2000);
  }

  removePremix(premix): void {
    this.getService.removePremix(premix.id).subscribe(
      (res: any) => {
      },
      (error) => this.handleError(error)
    );
    this.getService.GetCompanyInfo(4).subscribe(
      (res: any) => {
        this.usersList = {
          tableHeader: ['id', 'name', 'userName', 'address', 'phone', 'email', 'lastLogin', 'action'],
          tableBody: res,
        };
        this.isLoading = false;
      },
      (error) => this.handleError(error)
    );
  }

  /*here is the function needed to get all company info*/
  GetAllCompanyInfo(): void {
    this.getService.GetCompanyInfo(4).subscribe(
      (res: any) => {
        if (res) {
          this.companyForm.patchValue({
            companyName: res.companyProfileDto.name.en,
            companyAddress: res.companyProfileDto.address,
            companyPhone: res.companyProfileDto.phone,
            companyEmail: res.companyProfileDto.email,
          });
          this.usersList = {
            tableHeader: ['id', 'name', 'userName', 'address', 'phone', 'email', 'lastLogin', 'action'],
            tableBody: res.portalUserDTOs,
          };
          this.isLoading = false;
        }
      },
      (error) => this.handleError(error)
    );
  }

  /*here is the function needed to get the company types*/
  GetCompanyTypes(): void {
    this.getService.GetCompanyInfo(4).subscribe(
      (data: any) => {
        this.companyTypes = {
          tableHeader: ['id', 'name'],
          tableBody: data.companyTypeDto,
        };
        this.isLoading = false;
      },
      (error) => this.handleError(error)
    );
  }

  /*here is the function needed to fetch the list of roles added*/
  GetCompanyRoles(): void {
    this.getService.GetAllRoles(4).subscribe(
      (data) => {
        this.AllRoles = data;
      },
      (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    );
  }

  /*here is the function needed to fetch all list of services*/
  GetServices(): void {
    this.getService.GetAllServiceList(4).subscribe(
      (data) => {
        this.serviceList = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    );
  }

  GetSelectedService(service: any): void {
    this.sentServices.push(service.id);
  }

  onSubmit(): void {
    if (this.AddRoles.invalid) {
      this.handleError('Please choose role');
    } else if (this.sentServices.length === 0) {
      this.handleError('Please choose services');
    } else {
      const body = {role: this.AddRoles.controls.Roles.value, services: this.sentServices};
      this.getService.AssignRolesToServices(body).subscribe(
        (data) => {
          this.isLoading = false;
          this.handleSuccess('Done add services for selected role');
          this.serviceList = [];
          this.AddRoles.reset();
        },
        (error) => this.handleError(error)
      );
    }
  }

  /*here is the function needed to open a modal needed to add a role to the selected user*/
  OpenAddRoleModal(): void {
    this.modalRef = this.modalService.show(this.addUserInCompanyProfile, this.modalOptions);
  }

  OpenAddServicesInUser(event): void {
    this.selectedUser = event;

    this.modalServiceRef = this.modalService.show(this.addServicesForSpecificUserInCompanyProfile, this.modalOptions);
  }

  selectService(event, serviceData): void {
    if (event.checked) {
      this.selectedService.push(serviceData.id);
    } else {
      if (this.selectedService.filter(item => item === serviceData.id).length) {
        const indexOfSelectedServices = this.selectedService.indexOf(serviceData.id);
        this.selectedService.splice(indexOfSelectedServices, 1);
      }
    }
  }

  /*here is the function needed to submit added role for the user*/
  submitAddNewUser(): void {
    this.getService.AddNewUser(this.addUserForm.value).subscribe(res => {
        if (res) {
          this.handleSuccess('Successful add role for selected user');
          this.isLoading = false;
          this.modalRef.hide();
          this.GetAllCompanyInfo();
        } else {
          this.handleError('Invalid use');
          this.isLoading = false;
          this.modalRef.hide();
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  addServicesForUser(portalUserId): void {
    this.isLoading = true;
    this.getService.setServicesInUser(this.selectedService, portalUserId).subscribe(res => {
        if (res) {
          this.modalServiceRef.hide();
          this.isLoading = false;
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
  }
}
