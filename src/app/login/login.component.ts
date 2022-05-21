import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FormService} from '../services/form.service';
import {InputService} from '../services/input.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  alertNotificationStatus: boolean = false;
  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  isLoading: boolean = false;
  returnUrl: string;

  constructor(private fb: FormBuilder,
              private getService: FormService,
              private inputService: InputService,
              private router: Router,
              private route: ActivatedRoute) {
    this.form = this.fb.group({
      username: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required),
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  submit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.getService.loginAPIToken(this.form.value).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.alertNotificationStatus = true;
          this.inputService.publish({type: 'Token', payload: res.token});
          this.inputService.publish({
            type: 'CompanyData', payload: {
              companyId: res.company_Profile_ID,
              CompanyName: res.companyName,
              CompanyRoleID: res.companyRoleID,
            }
          });
          localStorage.setItem('CompanyData', JSON.stringify({
            companyId: res.company_Profile_ID,
            CompanyName: res.companyName,
            CompanyRoleID: res.companyRoleID,
          }))
          localStorage.setItem('privateData', res.token); // Verna
          this.router.navigateByUrl('/pages/home');
        }
      }, error => this.handleError(error));
    }
  }

  handleError(message) {
    this.isLoading = false;
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = {msg: message};
  }
}
