import {
  Component,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DecimalPipe} from '@angular/common';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {TabsetComponent} from 'ngx-bootstrap/tabs';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';
import {InputService} from 'src/app/services/input.service';
import {FormService} from 'src/app/services/form.service';
import {stringify} from 'querystring';

@Component({
  selector: 'app-create-or-edit-premix',
  templateUrl: './create-or-edit-premix.component.html',
  styleUrls: ['./create-or-edit-premix.component.scss'],
})
export class CreateOrEditPremixComponent implements OnInit {
  //Initializations
  PremixForm: FormGroup;
  selectedPremix: any;
  view: boolean;
  premixObj: premix = {} as premix;
  formData = null;
  premixID: any;
  editedPremix: premix = {} as premix;
  selectedOriginCountry: any;
  filteredOptionsForSupplierCountry: Observable<LookupState[]>;
  filteredOptionsForOriginCountry: Observable<LookupState[]>;
  filteredOptionsForRawMaterialType: Observable<any[]>;
  filteredOptionsForFunctionList: [rawMaterialfunction];
  selectedFunctionId: number;
  currentLang = this.translateService.currentLang
    ? this.translateService.currentLang
    : 'en';
  isLoading: boolean = false;
  premixIngredientsList;
  newIngredientlist;
  newBatchlist;

  premixBatchesList;
  Ingredients = [];
  Batches = [];
  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  selectedOriginCountryId;
  selectedSupplierCountryId;
  selectedRawId: number;
  test: any;

  constructor(
    private fb: FormBuilder,
    private number: DecimalPipe,
    private router: Router,
    private route: ActivatedRoute,
    private inputService: InputService,
    public translateService: TranslateService,
    private modalService: BsModalService,
    private getService: FormService
  ) {
    this.getFormAsStarting('', '');
  }

  async ngOnInit(): Promise<any> {
    this.premixObj.premixIngredientsDTO = [];
    this.premixObj.premixBatchDtos = [];
    this.editedPremix.premixIngredientsDTO = [];
    this.editedPremix.premixBatchDtos = [];
    await this.inputService
      .getInput$()
      .pipe(
        filter((x) => x.type === 'allLookups'),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.formData = {
          ...res.payload,
        };

        this.setAllLookupsInObservable();
      });

    this.isLoading = false;

    //saving the parameter passed ID into component
    this.route.params.subscribe((params: any) => {
      this.premixID = params.id;
      if (this.premixID) {
        this.getPermixById(this.premixID);
      }

      //when the user uses premix edit "ReadOnly form Disabled "
      if (
        this.route.snapshot.queryParams.view == undefined ||
        this.route.snapshot.queryParams.view == 'false'
      ) {
        this.view = false;

        //when the user uses premix view "ReadOnly form activated "
      } else if (this.route.snapshot.queryParams.view === 'true') {
        this.view = true;
        this.PremixForm.disable();
      }
    });
  }

  // getting premix data by parameter passed ID and passing data into PremixForm
  getPermixById(id) {
    this.premixID = id;
    this.getService.getPermixById(id).subscribe((res: any) => {
      this.selectedPremix = res;
      this.PremixForm.get('id').setValue(this.selectedPremix.id),
        this.PremixForm.get('premixName').setValue(this.selectedPremix.name);
      this.PremixForm.get('notificationNumber').setValue(
        this.selectedPremix.notificationNo
      );
      this.PremixForm.get('originCompany').setValue(
        this.selectedPremix.companyOrigin
      );

      this.PremixForm.get('originCountry').setValue(
        this.selectedPremix.countryOriginDTO.name.en
      );

      this.PremixForm.get('companySupplier').setValue(
        this.selectedPremix.companySupplier
      );
      this.PremixForm.get('supplierCountry').setValue(
        this.selectedPremix.countrySupplierDTO.name.en
      );
      // prenting coming Ingredients into table
      for (
        let i = 0;
        i < this.selectedPremix.premixIngredientsDTO.length;
        i++
      ) {
        this.premixIngredientsList = {
          tableHeader: [
            'id',
            'name',
            'concentration',
            'functionName',
            'functionId',
            'action',
          ],
          tableBody: this.selectedPremix.premixIngredientsDTO,
        };

        // this.PremixForm.get('IngredientId').setValue(
        //   this.selectedPremix.premixIngredientsDTO[i].id
        // );
        // this.PremixForm.get('concentration').setValue(
        //   this.selectedPremix.premixIngredientsDTO[i].concentration
        // );
        // this.PremixForm.get('functionId').setValue(
        //   this.selectedPremix.premixIngredientsDTO[i].functionId
        // );
        this.PremixForm.get('rowMaterialNameField').setValue(
          this.selectedPremix.premixIngredientsDTO[i].ingredientsId
        );
      }
      //prenting incoming patches into table
      for (let i = 0; i < this.selectedPremix.premixBatchDtos.length; i++) {
        this.premixBatchesList = {
          tableHeader: ['batchNo', 'productionDate', 'validityDate', 'action'],
          tableBody: this.selectedPremix.premixBatchDtos,
        };
      }

      //
    });
  }

  handleError(message): void {
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = {msg: message};
    this.isLoading = false;
  }

  AddBatchToList(index): void {
    const data = {
      id: this.PremixForm.get('Batches').value[index].id,
      batchNo: this.PremixForm.get('Batches').value[index].batchNo,
      productionDate: this.PremixForm.get('Batches').value[index].productionDate,
      validityDate: this.PremixForm.get('Batches').value[index].validityDate,
    };
    this.addBatchesDetailsRows()
  }

  batchesDetailsRows(): FormArray {
    return this.PremixForm.get('Batches') as FormArray;
  }

  addBatchesDetailsRows(): void {
    this.batchesDetailsRows().push(this.fb.group({
      id: this.fb.control(''),
      batchNo: this.fb.control('', Validators.required),
      productionDate: this.fb.control('', Validators.required),
      validityDate: this.fb.control('', Validators.required),
    }));
  }

  removeBatchesDetailsRows(index): void {
    this.batchesDetailsRows().removeAt(index);
    if (this.batchesDetailsRows().length === 0) {
      this.addBatchesDetailsRows();
    }
  }

  AddIngredientToList(index): void {
    // this.selectedFunctionId = this.filteredOptionsForFunctionList.find((o) => o.functionName === this.PremixForm.get('Ingredients').value[index].functionId).id;
    // this.selectedRawId = this.getIdFromLookupByNameWithDiffModel(this.formData?.rawMaterialList, this.PremixForm.get('Ingredients').value[index].ingredientsId);
    const data = {
      id: this.PremixForm.get('Ingredients').value[index].id,
      ingredientsId: this.PremixForm.get('Ingredients').value[index].functionId,
      concentration: Number(this.PremixForm.get('concentration').value),
      functionId: this.PremixForm.get('Ingredients').value[index].ingredientsId,
    };

    this.addIngrediantDetailsRows();
  }

  IngrediantDetailsRows(): FormArray {
    return this.PremixForm.get('Ingredients') as FormArray;
  }

  addIngrediantDetailsRows(): void {
    this.IngrediantDetailsRows().push(this.fb.group({
      id: this.fb.control(''),
      ingredientsId: this.fb.control('', Validators.required),
      concentration: this.fb.control('', Validators.required),
      functionId: this.fb.control('', Validators.required),
    }));
  }

  removeIngrediantDetailsRows(index): void {
    this.IngrediantDetailsRows().removeAt(index);
    if (this.IngrediantDetailsRows().length === 0) {
      this.addIngrediantDetailsRows();
    }
  }

  getIdFromLookupByNameWithDiffModel(list, value): void {
    let id;
    list.filter((option) => option.inciName === value).map((res) => {
      id = res.id;
    });

    return id;
  }

  getNameFromLookupByIdWithDiffModel(list, value): void {
    let name;
    list
      .filter((option) => option.id === value)
      .map((res) => {
        name = res.inciName;
      });

    return name;
  }

  setAllLookupsInObservable(): void {
    this.filteredOptionsForRawMaterialType = this.filterLookupsFunction(
      'rowMaterialNameField',
      this.PremixForm.get('rowMaterialNameField'),
      this.formData?.rawMaterialList
    );
    this.filteredOptionsForSupplierCountry = this.filterLookupsFunction(
      'countries',
      this.PremixForm.get('supplierCountry'),
      this.formData?.countries
    );
    this.filteredOptionsForOriginCountry = this.filterLookupsFunction(
      'countries',
      this.PremixForm.get('originCountry'),
      this.formData?.countries
    );
    this.getService.getPremixListofFunctions().subscribe(
      (res: any) => {
        this.filteredOptionsForFunctionList = res;
      },
      (error) => this.handleError(error)
    );
  }

  getFormAsStarting(data, fromWhere): void {
    if (data) {
    } else {
      this.PremixForm = this.fb.group({
        id: 0,
        premixName: this.fb.control(''),
        notificationNumber: this.fb.control(''),
        originCompany: this.fb.control(''),
        originCountry: this.fb.control(''),
        companySupplier: this.fb.control(''),
        supplierCountry: this.fb.control(''),
        Ingredients: this.fb.array([this.fb.group({
          id: this.fb.control(''),
          ingredientsId: this.fb.control('', Validators.required),
          concentration: this.fb.control('', Validators.required),
          functionId: this.fb.control('', Validators.required),
        })]),
        Batches: this.fb.array([this.fb.group({
          id: this.fb.control(''),
          batchNo: this.fb.control('', Validators.required),
          productionDate: this.fb.control('', Validators.required),
          validityDate: this.fb.control('', Validators.required),
        })]),
      });
    }
  }

  getDecimalValue(value, fromWhere): void {
    this.PremixForm.patchValue(
      {
        concentration: this.number.transform(
          this.PremixForm.get('concentration').value,
          '1.2-2'
        ),
      },
      {emitEvent: false}
    );
  }

  filterLookupsFunction(whichLookup, formControlValue, list, index?: any): any {
    if (whichLookup === 'rowMaterialNameField') {
      if (formControlValue) {
        return formControlValue.valueChanges.pipe(
          startWith(''),
          map((state) =>
            state
              ? this.filterInsideListForDiffModel(
              whichLookup,
              state,
              list,
              index
              ).slice(0, 3000)
              : list.slice(0, 3000)
          )
        );
      }
    } else {
      if (formControlValue) {
        return formControlValue.valueChanges.pipe(
          startWith(''),
          map((state) =>
            state
              ? this.filterInsideList(whichLookup, state, list)
              : list.slice()
          )
        );
      }
    }
  }

  filterInsideList(lookup, value, list, index?: any): LookupState[] {
    let filterValue;
    if (value) {
      filterValue = value.toLowerCase() ? value.toLowerCase() : '';
    }
    return list
      .filter((option) =>
        option.name[this.currentLang].toLowerCase().includes(filterValue)
      )
      .map((x) => x);
  }

  filterInsideListForDiffModel(lookup, value, list, index?: any): any[] {
    let filterValue;
    if (value) {
      filterValue = value.toLowerCase() ? value.toLowerCase() : '';
    }
    return list
      .filter((option) => option.inciName.toLowerCase().includes(filterValue))
      .map((x) => x);
  }

  //Edit premix button functionality |direct to Add-Edit Premix  component with ID in params|
  editPremix() {
    this.route.snapshot.queryParams = {view: 'false'};
    this.ngOnInit();
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {view: 'false'},
      queryParamsHandling: 'merge',
    });
  }

  //submit function for added or edited premix
  onSubmit() {
    const data = this.PremixForm.value;
    this.selectedOriginCountryId = this.getIdFromLookupByName(
      this.formData?.countries,
      this.PremixForm.get('originCountry').value
    );
    this.selectedSupplierCountryId = this.getIdFromLookupByName(
      this.formData?.countries,
      this.PremixForm.get('supplierCountry').value
    );

    if (this.premixID) {
      // for (let i = 0; i < this.Ingredients.length; i++) {
      //   const input = {
      //     id: i,
      //     IngredientId: this.Ingredients[i].id,
      //     concentration: this.Ingredients[i].concentration,
      //     functionId: this.selectedFunctionId,
      //   };

      //   this.editedPremix.premixIngredientsDTO.push(input);
      // }
      // for (let i = 0; i < this.Batches.length; i++) {
      //   const input = {
      //     batchNo: this.Batches[i].batchNo,
      //     productionDate: this.Batches[i].productionDate,
      //     validityDate: this.Batches[i].validityDate,
      //   };
      //   this.editedPremix.premixBatchDtos.push(input);
      // }
      this.editedPremix.LkupCountryOrigin = this.selectedOriginCountryId;
      this.editedPremix.LkupCountrySupplier = this.selectedSupplierCountryId;

      this.editedPremix.CompanyOrigin = data.originCompany;

      this.editedPremix.companySupplier = data.companySupplier;

      this.editedPremix.id = this.premixID;
      this.editedPremix.Name = data.premixName;
      this.editedPremix.NotificationNo = data.notificationNumber;
      this.editedPremix.premixIngredientsDTO = this.newIngredientlist;
      this.editedPremix.premixBatchDtos = this.newBatchlist;
      this.getService.AddNewPremix(this.editedPremix).subscribe((res) => {
        this.router.navigate([`/pages/cosmetics-product/inner/premix-list`]);
      });
    } else if (!this.premixID) {
      this.premixObj.id = 0;
      this.premixObj.NotificationNo = data.notificationNumber;
      this.premixObj.Name = data.premixName;
      this.premixObj.CompanyOrigin = data.originCompany;
      this.premixObj.companySupplier = data.companySupplier;
      this.premixObj.LkupCountryOrigin = this.selectedOriginCountryId;
      this.premixObj.LkupCountrySupplier = this.selectedSupplierCountryId;

      for (let i = 0; i < this.Ingredients.length; i++) {
        const data = {
          id: i,
          ingredientsId: this.Ingredients[i].id,
          concentration: this.Ingredients[i].concentration,
          functionId: this.selectedFunctionId,
        };
        this.premixObj.premixIngredientsDTO.push(data);
      }
      for (let i = 0; i < this.Batches.length; i++) {
        const input = {
          // id: this.selectedPremix.premixBatchDtos[i].id,
          batchNo: this.Batches[i].batchNo,
          productionDate: this.Batches[i].productionDate,
          validityDate: this.Batches[i].validityDate,
        };
        this.premixObj.premixBatchDtos.push(input);
      }
      this.getService.AddNewPremix(this.premixObj).subscribe((res) => {
        this.router.navigate([`/pages/cosmetics-product/inner/premix-list`]);
      });
    }
  }

  getIdFromLookupByName(list, value) {
    let id;
    list
      .filter((option) => option.name[this.currentLang] === value)
      .map((res) => {
        id = res.id;
      });

    return id;
  }
}

//interfaces Section
export interface LookupState {
  code: string;
  description: { en: string; ar: string };
  id: number;
  name: { en: string; ar: string };
}

export interface premix {
  id: number;
  NotificationNo: string;
  Name: string;
  CompanyOrigin: string;
  companySupplier: string;
  LkupCountryOrigin: { en: string; ar: string };
  LkupCountrySupplier: { en: string; ar: string };
  premixIngredientsDTO: PremixIngredients[];
  premixBatchDtos: premixBatch[];
}

//premix patches interface
export interface premixBatch {
  batchNo: number;
  productionDate: Date;
  validityDate: Date;
}

export interface PremixIngredients {
  id: number;
  ingredientsId: number;
  functionId: number;
  concentration: number;
}

export interface rawMaterialfunction {
  id: number;
  functionName: string;
}
