import {Component, OnInit} from '@angular/core';
import {
  CardsList,
  DepartmentBEModel,
  ServicesPerAdmin,
  ServicesPerAdminAfterIntegrating
} from "../../../utils/common-models";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {CosmeticsProductService} from "../cosmetics-product.service";
import {TranslateService} from "@ngx-translate/core";
import {distinctUntilChanged, filter} from "rxjs/operators";
import {InputService} from "../../services/input.service";
import {commonKeysWithId, menuObjectKeys, typeOfRequest} from "../../../utils/common-data";
import {element} from "protractor";

@Component({
  selector: 'app-cosmetics-products',
  templateUrl: './cosmetics-products.component.html',
  styleUrls: ['./cosmetics-products.component.scss']
})
export class CosmeticsProductsComponent implements OnInit {
  routingPath: string;
  departId: string;
  departSecId: string;
  cosmeticsProductsServices: ServicesPerAdminAfterIntegrating[] = [];

  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  isLoading: boolean = false;
  currentLang = this.translateService.currentLang ? this.translateService.currentLang : 'en';

  constructor(private router: Router,
              private inputService: InputService,
              public translateService: TranslateService,
              private services: CosmeticsProductService,
              private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routingPath = event.url.split('/')[4];
      }
    });

    this.activatedRoute.params.subscribe(res => {
      this.departId = res.departId;
      this.departSecId = res.departSecId;
    })
  }

  ngOnInit(): void {
    let newList = []
    this.inputService.getInput$().pipe(
      filter(x => x.type === 'departments'),
      distinctUntilChanged()
    ).subscribe((res: { type: string, payload: DepartmentBEModel[] }) => {
      res.payload.filter(item => item.id === Number(this.departId)).map((result: DepartmentBEModel) => {
        result.sections.filter(element => element.id === Number(this.departSecId)).map(row => {
          row.servicesList?.map(service => {
            this.cosmeticsProductsServices = [
              ...this.cosmeticsProductsServices,
              {
                code: service.code,
                id: service.id,
                name: service.name,

                description: service.description,
                newRequestLink: menuObjectKeys[commonKeysWithId[this.departId]].newRequestLink,
                draftListLink: menuObjectKeys[commonKeysWithId[this.departId]].draftListLink,
                trackListLink: menuObjectKeys[commonKeysWithId[this.departId]].trackListLink,
                newImortedRequestLink: menuObjectKeys[commonKeysWithId[this.departId]].newImortedRequestLink,
                draftImportedListLink: menuObjectKeys[commonKeysWithId[this.departId]].draftImportedListLink,
                trackImportedListLink: menuObjectKeys[commonKeysWithId[this.departId]].trackImportedListLink,
                icon: menuObjectKeys[commonKeysWithId[this.departId]].servicesIcon,
                serviceTypeDto: service.serviceTypeDto,
                itemTypeList: service.itemtypes,
              }
            ];

            this.inputService.publish({type: 'productServices', payload: this.cosmeticsProductsServices});
          });
        })
      });
    });


    this.inputService.getInput$().pipe(
      filter(x => x.type === 'currentLang'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.currentLang = res.payload;
    });
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
}
