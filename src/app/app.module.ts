import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, of } from 'rxjs';
import {CurrencyPipe,DatePipe,DecimalPipe,registerLocaleData,} from '@angular/common';
import localeAr from '@angular/common/locales/de';
import localeArabicExtra from '@angular/common/locales/extra/de';
import localeEn from '@angular/common/locales/en';
import localeEnglishExtra from '@angular/common/locales/extra/en';
import arTranslation from '../assets/i18n/ar.json';
import enTranslation from '../assets/i18n/en.json';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormService } from './services/form.service';
import { LoginComponent } from './login/login.component';
import { HomeContainerComponent } from './home-container/home-container.component';
import { LoaderComponentComponent } from './shared-components/loader-component/loader-component.component';
import { FiltersComponent } from './shared-components/filters/filters.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { CustomReleaseComponent } from './custom-release/custom-release.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsComponentComponent } from './charts-component/charts-component.component';
import { CardListComponent } from './shared-components/card-list/card-list.component';
import { CardComponent } from './shared-components/card/card.component';
import { PharmaceuticalRawMaterialsModule } from './pharmaceutical-raw-materials/pharmaceutical-raw-materials.module';
import { SharedComponentsModule } from './shared-components/shared-components.module';
import { CosmeticsProductsModule } from './cosmetics-products/cosmetics-products.module';
import { PremixListComponent } from './Premix/premix-list/premix-list.component';
import { CreateOrEditPremixComponent } from './Premix/create-or-edit-premix/create-or-edit-premix.component';
import { AccountsListComponent } from './account-management/accounts-list/accounts-list.component';
import { CreateOrEditAccountComponent } from './account-management/create-or-edit-account/create-or-edit-account.component';
import { ViewAccountComponent } from './account-management/view-account/view-account.component';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
//import { RelesecommentsComponent } from './relesecomments/relesecomments.component';
import { CommentsComponent } from './comments/comments.component';
import { ViewReleaseCommentsComponent } from './comments/view-release-comments/view-release-comments.component';
import { InputService } from './services/input.service';
import { initializeAppFactory } from './services/initializeApp.service';
import { Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
//import { DynamicParentFormComponent } from './DynamicForms/ParentForm/dynamic-parent-form/dynamic-parent-form.component';
//import { FormControlComponent } from './DynamicForms/FormControl/form-control/form-control.component';

registerLocaleData(localeAr, 'ar-Ar', localeArabicExtra);
registerLocaleData(localeEn, 'en-EN', localeEnglishExtra);

export class CustomLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations[lang]);
  }
}

const translations = {
  de: arTranslation,
  en: enTranslation,
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    LoginComponent,
    HomeContainerComponent,
    NotificationListComponent,
    CustomReleaseComponent,
    // RelesecommentsComponent,
    DashboardComponent,
    ChartsComponentComponent,
    AccountsListComponent,
    CreateOrEditAccountComponent,
    ViewAccountComponent,
    CommentsComponent,
    ViewReleaseCommentsComponent,


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatRadioModule,
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
    MatTableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    PharmaceuticalRawMaterialsModule,
    CosmeticsProductsModule,
    SharedComponentsModule,
  ],
  providers: [
    DecimalPipe,
    DatePipe,
    FormService,
    CurrencyPipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [InputService, Router, FormService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
