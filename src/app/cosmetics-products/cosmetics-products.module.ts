import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CosmeticsProductsRoutingModule} from './cosmetics-products-routing.module';
import {DraftRequestsComponent} from './draft-requests/draft-requests.component';
import {TrackRequestsComponent} from './track-requests/track-requests.component';
import {CosmeticsProductsContainerComponent} from './cosmetics-products-container/cosmetics-products-container.component';
import {CosmeticsProductsComponent} from './cosmetics-products/cosmetics-products.component';
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {AccordionModule} from "ngx-bootstrap/accordion";
import {ModalModule} from "ngx-bootstrap/modal";
import {TabsModule} from "ngx-bootstrap/tabs";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {AlertModule} from "ngx-bootstrap/alert";
import {PaginationModule} from "ngx-bootstrap/pagination";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {HttpClientModule} from "@angular/common/http";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatNativeDateModule} from "@angular/material/core";
import {TranslateModule} from "@ngx-translate/core";
import {SharedComponentsModule} from "../shared-components/shared-components.module";
import {CosmeticsProductService} from "./cosmetics-product.service";
import { PremixListComponent } from '../Premix/premix-list/premix-list.component';
import { CreateOrEditPremixComponent } from '../Premix/create-or-edit-premix/create-or-edit-premix.component';
import { CosmaticImportationComponent } from './cosmetics-importation/cosmatic-importation/cosmatic-importation.component';
import { TrackImportRequestsComponent } from './cosmetics-importation/track-import-requests/track-import-requests.component';
import { DraftImportRequestsComponent } from './cosmetics-importation/draft-import-requests/draft-import-requests.component';
import { FinishedProductSamplesComponent } from './Cosmatics-Release/finished-product-samples/finished-product-samples.component';


@NgModule({
  declarations: [DraftRequestsComponent, TrackRequestsComponent, CosmeticsProductsContainerComponent, CosmeticsProductsComponent    , PremixListComponent,
    CreateOrEditPremixComponent,
    CosmaticImportationComponent,
    TrackImportRequestsComponent,
    
    DraftImportRequestsComponent,
    
    FinishedProductSamplesComponent],
  imports: [
    CommonModule,
    CosmeticsProductsRoutingModule,
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    MatExpansionModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatSliderModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    TranslateModule,
    SharedComponentsModule
  ],
  providers:[
    CosmeticsProductService
  ]
})
export class CosmeticsProductsModule {
}
