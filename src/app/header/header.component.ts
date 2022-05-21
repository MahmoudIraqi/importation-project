import {Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {FormService} from '../services/form.service';
import {FormBuilder} from '@angular/forms';
import {InputService} from '../services/input.service';
import {distinctUntilChanged, filter} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import {DepartmentBEModel, DepartmentIntegratingModel} from "../../utils/common-models";
import {menuObjectKeys} from "../../utils/common-data";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {

  @Input() Username;
  @Input()  notificationCount;
  @Output()  notificationsCount;
  @Output() selectedLanguage = new EventEmitter();
  screenWidth;
  menuObject: DepartmentIntegratingModel[] = [];
  alertNotificationStatus: boolean = false;
  alertNotification: any;
  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  isLoading: boolean = false;
  Token;
  currentLang = this.translateService.currentLang ? this.translateService.currentLang : 'en';

  constructor(private fb: FormBuilder,
              private getService: FormService,
              private inputService: InputService,
              private router: Router,
              public translateService: TranslateService,
              private route: ActivatedRoute) {
    translateService.addLangs(['en', 'ar']);
    translateService.setDefaultLang('en');

    this.onResize();
  }

  ngOnChanges(): void {
  }

  ngOnInit(): void {
    this.inputService.getInput$().pipe(
      filter(x => x.type === 'Token'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.Token = res.payload;
    });

    this.inputService.getInput$().pipe(
      filter(x => x.type === 'currentLang'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.currentLang = res.payload;
    });

    this.inputService.getInput$().pipe(
      filter(x => x.type === 'departments'),
      distinctUntilChanged()
    ).subscribe((res: { type: string, payload: DepartmentBEModel[] }) => {
      res.payload.map(item => {
        this.menuObject = [
          ...this.menuObject,
          {
            code: item.code,
            id: item.id,
            name: item.name,
            link: menuObjectKeys[item.code]?.baseLink,
            dropDownStatus: item.sections.length > 0,
            icon: menuObjectKeys[item.code]?.baseIcon,
            description: item.description,
            dropdownLinks: item.sections?.map(element => {
              return {
                ...element,
                link:
                  menuObjectKeys[item.code]?.dropdownLinks[element.code].link && menuObjectKeys[item.code]?.dropdownLinks[element.code].link !== '#' ?
                    `${menuObjectKeys[item.code]?.dropdownLinks[element.code].link}/${item.id}/${element.id}` :
                    menuObjectKeys[item.code]?.dropdownLinks[element.code].link,
                icon: menuObjectKeys[item.code]?.dropdownLinks[element.code].icon,
              }
            })
          }
        ];
      });
    });

    this.getService.GetNotificationCount().subscribe((res: any) => {
     if(res)
     {
       
       this.notificationsCount=res;}
      this.isLoading = false;
    }, error => this.handleError(error));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }

  isActive(link) {
    return this.router.url.includes(`${link}`);
  }

  logoutFunction() {
    this.getService.logoutAPIToken(this.Token).subscribe((res: any) => {
      if (res) {
        this.isLoading = false;
        this.router.navigate(['/login']).then(() => location.reload());
      } else {
        this.alertErrorNotificationStatus = true;
      }
    }, error => this.handleError(error));
  }

  handleError(message) {
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = {msg: message};
    this.isLoading = false;
  }

  translateSite(language: string) {
    this.translateService.use(language);

    this.selectedLanguage.emit(language);
  }
 public RedirectToHome()
  {this.router.navigate(['/pages/home']);}					 										  
}
