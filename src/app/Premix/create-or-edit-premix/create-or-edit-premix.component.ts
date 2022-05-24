import {
    Component, OnDestroy,
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
import {Observable, Subscription} from 'rxjs';
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
export class CreateOrEditPremixComponent implements OnInit, OnDestroy {
    PremixForm: FormGroup;
    selectedPremix: any;
    view: boolean;
    premixObj: Premix = {} as Premix;
    formData = null;
    premixID: any;
    editedPremix: Premix = {} as Premix;
    selectedOriginCountry: any;
    filteredOptionsForSupplierCountry: Observable<LookupState[]>;
    filteredOptionsForOriginCountry: Observable<LookupState[]>;
    arrayOfObservablesForIngredient: Observable<any[]>[] = [];
    arrayOfObservablesForFunction: Observable<any[]>[] = [];
    filteredOptionsForRawMaterialType: Observable<any[]>;
    filteredOptionsForFunctionList: Observable<any[]>;
    selectedFunctionId: number;
    currentLang = this.translateService.currentLang ? this.translateService.currentLang : 'en';
    isLoading: boolean = false;
    premixIngredientsList;
    premixBatchesList;
    Ingredients = [];
    Batches = [];
    notificationNumberValidation: boolean = false;
    alertErrorNotificationStatus: boolean = false;
    alertErrorNotification: any;
    subscription: Subscription;

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

        this.notificationNumberValidation = false;
        await this.inputService.getInput$().pipe(
            filter((x) => x.type === 'allLookups'),
            distinctUntilChanged())
            .subscribe((res) => {
                this.formData = {
                    ...res.payload,
                };

                this.setAllLookupsInObservable();
            });

        this.isLoading = false;

        this.route.params.subscribe((params: any) => {
            this.premixID = params.id;
            if (this.premixID) {
                this.getPermixById(this.premixID);
            }
            if (!this.route.snapshot.queryParams.view) {
                this.view = false;
            } else if (this.route.snapshot.queryParams.view) {
                this.view = true;
                this.PremixForm.disable();
            }
        });
    }

    ngOnDestroy(): void {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }
    }

    // getting premix data by parameter passed ID and passing data into PremixForm
    getPermixById(id): void {
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
        const data = {
            id: this.PremixForm.get('Ingredients').value[index].id,
            ingredientsId: this.PremixForm.get('Ingredients').value[index].functionId,
            concentration: Number(this.PremixForm.get('Ingredients').value[index].concentration),
            functionId: this.PremixForm.get('Ingredients').value[index].ingredientsId,
        };

        this.addIngrediantDetailsRows();
    }

    rerenderSubscribtionForClosingActionForDetailsForm(index): void {
        this.getLookupForFormArray(index);

        // this._subscribeToClosingActionsForDetailsFormArray('ingredientsId', this.arrayOfObservablesForIngredient[index], index);
        // this._subscribeToClosingActionsForDetailsFormArray('functionId', this.arrayOfObservablesForFunction[index], index);
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

        this.rerenderSubscribtionForClosingActionForDetailsForm(this.IngrediantDetailsRows().controls.length - 1);
    }

    removeIngrediantDetailsRows(index): void {
        this.IngrediantDetailsRows().removeAt(index);
        this.arrayOfObservablesForIngredient.splice(index, 1);
        this.arrayOfObservablesForFunction.splice(index, 1);
        if (this.IngrediantDetailsRows().length === 0) {
            this.addIngrediantDetailsRows();
        }
    }

    validateNotificationNumber(value): void {
        this.getService.validateNotificationNumberForPremix(value).subscribe(res => {
            this.notificationNumberValidation = true;
            console.log('res', res);

            this.formData.rawMaterialList = res;
            this.rerenderSubscribtionForClosingActionForDetailsForm(0);
        });
    }

    private _subscribeToClosingActionsForDetailsFormArray(field, list, index): void {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }
        list ? list.subscribe(y => {
            debugger;
            if (y && y.length === 0) {
                this.IngrediantDetailsRows().controls.map((x, i) => {
                    if (i === index) {
                        if (x['controls'][field].dirty) {
                            x['controls'][field].setValue(null);
                        }
                    }
                });
            }
        }) : null;
    }

    getLookupForFormArray(index): void {
        this.IngrediantDetailsRows().controls.map((x) => {
            this.filteredOptionsForRawMaterialType = this.filterLookupsFunction('rowMaterialNameField', x.get('ingredientsId'), this.formData.rawMaterialList);
            this.filteredOptionsForFunctionList = this.filterLookupsFunction('functionId', x.get('functionId'), this.formData.function);
        });

        this.arrayOfObservablesForIngredient.push(this.filteredOptionsForRawMaterialType);
        this.arrayOfObservablesForFunction.push(this.filteredOptionsForFunctionList);
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
        this.arrayOfObservablesForIngredient = [];
        this.arrayOfObservablesForFunction = [];
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
        } else if (whichLookup === 'functionId') {
            if (formControlValue) {
                return formControlValue.valueChanges.pipe(
                    startWith(''),
                    map((state) =>
                        state
                            ? this.filterInsideListForDiffModelForFunction(whichLookup, state, list)
                            : list.slice()
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

    filterInsideListForDiffModelForFunction(lookup, value, list, index?: any): any[] {
        let filterValue;
        if (value) {
            filterValue = value.toLowerCase() ? value.toLowerCase() : '';
        }
        return list
            .filter((option) => option.functionName.toLowerCase().includes(filterValue))
            .map((x) => x);
    }

    editPremix(): void {
        this.route.snapshot.queryParams = {view: 'false'};
        this.ngOnInit();
        this.router.navigate(['.'], {
            relativeTo: this.route,
            queryParams: {view: 'false'},
            queryParamsHandling: 'merge',
        });
    }

    checkControllerValueWithList(list, formControlKey, formControlValue): void {
        debugger;
        let value;
        if (list.filter(option => option.name[this.currentLang] === formControlValue).length > 0) {
            list.filter(option => option.name[this.currentLang] === formControlValue).map(x => {
                value = x.id;
            });
        } else {
            this.PremixForm.get(formControlKey).patchValue('');
            value = '';
        }
        return value;
    }

    onSubmit(): void {
        if (this.PremixForm.valid) {
            const data = this.PremixForm.value;
            data.originCountry = this.checkControllerValueWithList(this.formData.countries, 'originCountry', data.originCountry);
            data.supplierCountry = this.checkControllerValueWithList(this.formData.countries, 'supplierCountry', data.supplierCountry);
            data.Ingredients.map(y => {
                y.concentration = Number(y.concentration);
                this.formData.rawMaterialList.filter(option => option.inciName === y.ingredientsId).map(item => y.ingredientsId = item.id);
                this.formData.function.filter(option => option.functionName === y.functionId).map(item => y.functionId = item.id);
            });

            this.getService.AddNewPremix(data).subscribe((res) => {
                this.router.navigate([`/pages/cosmetics-product/inner/premix-list`]);
            });
        } else {
            this.alertErrorNotificationStatus = true;
            this.alertErrorNotification = {msg: 'please complete the required values which marked with *'};
        }
    }

    onClosedErrorAlert(): void {
        setTimeout(() => {
            this.alertErrorNotificationStatus = false;
        }, 2000);
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

export interface LookupState {
    code: string;
    description: { en: string; ar: string };
    id: number;
    name: { en: string; ar: string };
}

export interface Premix {
    id: number;
    NotificationNo: string;
    Name: string;
    CompanyOrigin: string;
    companySupplier: string;
    LkupCountryOrigin: { en: string; ar: string };
    LkupCountrySupplier: { en: string; ar: string };
    premixIngredientsDTO: PremixIngredients[];
    premixBatchDtos: PremixBatch[];
}

export interface PremixBatch {
    id: number;
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

export interface RawMaterialfunction {
    id: number;
    functionName: string;
}
