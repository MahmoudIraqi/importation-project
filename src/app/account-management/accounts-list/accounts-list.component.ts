import { DecimalPipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { FormService } from 'src/app/services/form.service';
import { InputService } from 'src/app/services/input.service';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss'],
})
export class AccountsListComponent implements OnInit {
  @ViewChild('ComapnyTabs', { static: false }) formTabs: TabsetComponent;
  @ViewChild('addRoleUserModal') modalDeletedTemplate: TemplateRef<any>;

  modalRef: BsModalRef;
  modalOptions: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    class: 'modal-xl packagingModal',
  };
  companyForm: FormGroup;
  UserRoleForm: FormGroup;
  AddRoles: FormGroup;
  AllRoles = [];
  AllServiceList: any;
  usersList;
  companyTypes: any;
  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  isLoading: boolean = false;
  currentLang = this.translateService.currentLang
    ? this.translateService.currentLang
    : 'en';

  constructor(
    private fb: FormBuilder,
    private number: DecimalPipe,
    private router: Router,
    private route: ActivatedRoute,
    private inputService: InputService,
    public translateService: TranslateService,
    private getService: FormService,
    private modalService: BsModalService
  ) {}
  ngOnInit(): void {
    this.isLoading = false;
    this.getFormAsStarting('', '');
    this.isLoading = false;
    //company info function call go here
    this.GetAllComapnyInfo();
    this.GetCompanyTypes();
    this.GetCompanyRoles();
    this.GetServices();
    this.AddRoles = this.fb.group({
      Roles: [null, Validators.required],
    });

    this.UserRoleForm = this.fb.group({
      Roles: [null, Validators.required],
    });
  }
  getFormAsStarting(data, fromWhere) {
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

  alertSuccessNotificationStatus: boolean = false;
  alertSuccessNotification: any;
  handleError(message) {
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = { msg: message };
    this.isLoading = false;
  }

  handleSuccess(message) {
    this.alertSuccessNotificationStatus = true;
    this.alertSuccessNotification = { msg: message };
    this.isLoading = false;
  }

  onClosedErrorAlert() {
    setTimeout(() => {
      this.alertErrorNotificationStatus = false;
    }, 2000);
  }
  removePremix(premix) {
    this.getService.removePremix(premix.id).subscribe(
      (res: any) => {},
      (error) => this.handleError(error)
    );
    this.getService.GetCompanyInfo(4).subscribe(
      (res: any) => {
        this.usersList = {
          tableHeader: [
            'id',
            'name',
            'userName',
            'address',
            'phone',
            'ip',
            'lastLogin',
            'action',
          ],
          tableBody: res,
        };
        this.isLoading = false;
      },
      (error) => this.handleError(error)
    );
  }

  //here is the function needed to get all company info
  GetAllComapnyInfo() {
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
            tableHeader: [
              'id',
              'name',
              'userName',
              'address',
              'phone',
              'ip',
              'lastLogin',
              'action',
            ],
            tableBody: res.portalUserDTOs,
          };
          this.isLoading = false;
        }
      },
      (error) => this.handleError(error)
    );
  }

  //here is the function needed to get the company types
  GetCompanyTypes() {
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

  //here is the function needed to fetch the list of roles added
  GetCompanyRoles() {
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

  //here is the function needed to fetch all list of services
  ServiceList;
  GetServices() {
    this.getService.GetAllServiceList(4).subscribe(
      (data) => {
        this.ServiceList = {
          tableHeader: ['ServiceId', 'ServiceName', 'ServiceCode', 'action'],
          tableBody: data,
        };
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    );
  }

  Sentservices = [];
  GetSelectedService(service: any) {
    // debugger;
    // // this.Sentservices = [];
    // let foundServiceId = this.Sentservices.find((element) => {
    //   element.id === service.id;
    // });
    // if (this.Sentservices.length == 0) {
    //   this.Sentservices.push(service.id);
    // } else if (this.Sentservices.length > 0) {
    //   if (foundServiceId) {
    //     this.handleError('This service is found');
    //   } else {
    //     this.Sentservices.push(service.id);
    //   }
    // }
    this.Sentservices.push(service.id);
  }

  onSubmit() {
    if (this.AddRoles.invalid) {
      this.handleError('Please choose role');
    } else if (this.Sentservices.length == 0) {
      this.handleError('Please choose services');
    } else {
      let body = {
        role: this.AddRoles.controls.Roles.value,
        services: this.Sentservices,
      };
      this.getService.AssignRolesToServices(body).subscribe(
        (data) => {
          this.isLoading = false;
          this.handleSuccess('Done add services for selected role');
          this.ServiceList = [];
          this.AddRoles.reset();
        },
        (error) => this.handleError(error)
      );
    }
  }

  //here is the function needed to open a modal needed to add a role to the selected user
  SelectedUser: any;
  OpenAddRoleModal(event) {
    this.modalRef = this.modalService.show(
      this.modalDeletedTemplate,
      (this.modalOptions = event)
    );
    this.SelectedUser = event.id;
    this.GetCompanyRoles();
  }

  //here is the function needed to submit added role for the user
  SubmitAdduserRole() {
    let body = {
      role: this.UserRoleForm.controls.Roles.value,
      portalUserId: this.SelectedUser,
    };
    this.getService.AddRoleUser(body).subscribe(
      (data) => {
        this.handleSuccess('Successful add role for selected user');
        this.isLoading = false;
        this.modalRef.hide();
        this.GetAllComapnyInfo();
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  //here is the function needed to delete the selected role
  DeleteSelectedRole() {}

  //here is the function needed to update the selected role
  UpdateSelectedRole() {}

  //here is the function needed to add a new role
  AddNewRole() {}
}
