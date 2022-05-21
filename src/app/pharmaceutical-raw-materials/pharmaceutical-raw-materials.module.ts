import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PharmaceuticalRawMaterialsRoutingModule} from './pharmaceutical-raw-materials-routing.module';
import {PharmaceuticalRawMaterialsComponent} from './pharmaceutical-raw-materials/pharmaceutical-raw-materials.component';
import {PharmaceuticalRawMaterialsContainerComponent} from "./pharmaceutical-raw-materials-container/pharmaceutical-raw-materials-container.component";
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
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatNativeDateModule} from "@angular/material/core";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../app.module";
import {SharedComponentsModule} from "../shared-components/shared-components.module";
import {DraftRequestsComponent} from './draft-requests/draft-requests.component';
import {TrackRequestsComponent} from './track-requests/track-requests.component';


@NgModule({
  declarations: [PharmaceuticalRawMaterialsComponent, PharmaceuticalRawMaterialsContainerComponent, DraftRequestsComponent, TrackRequestsComponent],
  imports: [
    CommonModule,
    PharmaceuticalRawMaterialsRoutingModule,
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
  ]
})
export class PharmaceuticalRawMaterialsModule {
}
