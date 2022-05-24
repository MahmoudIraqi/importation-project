import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute, Router} from '@angular/router';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {Observable} from 'rxjs';
import {InputService} from '../../services/input.service';
import {TranslateService} from '@ngx-translate/core';
import {distinctUntilChanged, filter} from 'rxjs/operators';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss'],
})
export class TableListComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() whichTable;
  @Input() approvedType;
  @Input() rejectedType;
  step;
  sortByForRequestNumber = [
    {
      id: 'descending',
      value: 'Descending ',
    },
    {
      id: 'ascending',
      value: 'Ascending ',
    },
  ];
  dataAfterFilters = [];
  filterData = {
    filterKey: [],
  };
  filterRow = [];
  keyForFilter;
  keyWordsForFilter;
  staticFilterKey = {
    BolNo: 'bolNo',
    supplierName: 'companyName',
    supplierCountry: 'countryName',
    requestType: 'releaseType',
    createdDate: 'createdDate',
    name: 'name',
    notificationNo: 'notificationNo',
    originName: 'countryOriginDTO',
  };
  sortStatus = false;
  alertNotificationStatus: boolean = false;
  currentLang = this.translateService.currentLang
    ? this.translateService.currentLang
    : 'en';

  filteredData: Observable<any[]>;

  @Input() removeFilterKey;
  @Output() removeDetailsRowOutput = new EventEmitter();
  @Output() removeDetailsRowIDs = new EventEmitter();
  @Output() removePackagingRowOutput = new EventEmitter();
  @Output() removePackagingRowIDs = new EventEmitter();
  @Output() editPackagingRowIDs = new EventEmitter();
  @Output() removeManufacturingRowOutput = new EventEmitter();
  @Output() removeManufacturingRowIDs = new EventEmitter();
  @Output() editManufacturingRowIDs = new EventEmitter();
  @Output() removeIngrediantDetailsRowOutput = new EventEmitter();
  @Output() removeIngrediantDetailsIDs = new EventEmitter();
  @Output() removeIngrediantRowOutput = new EventEmitter();
  @Output() editIngrediantRowOutput = new EventEmitter();
  @Output() removeProductFromKit = new EventEmitter();
  @Output() editDetailedRowOutput = new EventEmitter();
  @Output() copyDetailedRowOutput = new EventEmitter();
  @Output() seenNotification = new EventEmitter();
  @Output() editProductInInvoicesRows = new EventEmitter();
  @Output() removeProductInInvoicesRows = new EventEmitter();
  @Output() deleteDraftRequest = new EventEmitter();
  @Output() removeDraftProduct = new EventEmitter();
  @Output() removeIngredientfromPremix = new EventEmitter();
  @Output() deleteItemData = new EventEmitter();
  @Output() deleteInvoice = new EventEmitter();
  @Output() editInvoiceData = new EventEmitter();
  @Output() editCustomReleaseRequest = new EventEmitter();
  @Output() replaceCustomReleaseRequest = new EventEmitter();
  @Output() choosePackagingRow = new EventEmitter();
  @Output() chooseIngredientRow = new EventEmitter();
  @Output() chooseManufactureRow = new EventEmitter();
  @Output() selectItem = new EventEmitter();
  @Output() selectedDaraftITem = new EventEmitter();
  @Output() batchNumber = new EventEmitter();
  @Output() fileSelect = new EventEmitter();
  @Output() additemEvent = new EventEmitter();
  //edit-view premix requirements
  @Output() editIngredientfromPremix = new EventEmitter();
  @Output() editPremix = new EventEmitter();
  @Output() viewPremix = new EventEmitter();
  @Output() removePremix = new EventEmitter();
  @Output() removeBatchfromPremix = new EventEmitter();
  contentArray = [];
  returnedArray: string[];
  deletedIdsListForPackaging = [];
  deletedIdsListForManufacturing = [];
  deletedIdsListForDetailsRow = [];
  deletedIdsListForIngrediant = [];
  serviceId;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public translateService: TranslateService,
    private inputService: InputService
  ) {
    this.route.params.subscribe((res) => {
      this.serviceId = res.serviceId;
    });
  }

  ngOnChanges() {
    if (this.data) {
      if (this.data.tableBody && this.data.tableBody?.length > 0) {
        if (
          this.whichTable === 'drafted' ||
          this.whichTable === 'notificationList' ||
          this.whichTable === 'premixList' ||
          this.whichTable === 'track'
        ) {
          this.data.tableBody.sort((a, b) =>
            a.createdDate && b.createdDate
              ? a.createdDate > b.createdDate
              ? -1
              : 1
              : -1
          );

          if (this.whichTable === 'notificationList') {
            this.data.tableBody.sort((a, b) =>
              a.notification_time > b.notification_time ? -1 : 1
            );
            // this.data.tableBody.sort((a, b) => (a.requestID > b.requestID) ? -1 : 1);
            this.data.tableBody.map((x) => {
              x.ID = x.ID ? x.ID.toString() : null;
              x.NotificationNo = x.NotificationNo
                ? x.NotificationNo.toString()
                : '';
              x.oldNotificationNo = x.oldNotificationNo
                ? x.oldNotificationNo.toString()
                : '';
            });
          }

          const tableColumnID = Object.keys(this.data.tableBody[0]).map(
            (x, i) => x
          );
          this.filterData.filterKey = [];

          this.data.tableHeader.map((x, i) => {
            if (this.staticFilterKey[this.data.tableHeader[i]]) {
              this.filterData.filterKey.push({
                name: this.data.tableHeader[i],
                id: this.staticFilterKey[this.data.tableHeader[i]],
              });
            }
          });

          this.contentArray = new Array(this.data.tableBody.length).fill('');
          this.contentArray = this.contentArray.map(
            (v: string, i: number) => this.data.tableBody[i]
          );
          this.returnedArray = this.contentArray.slice(0, 10);
        }
      }
    }
  }

  ngOnInit(): void {
    this.inputService
      .getInput$()
      .pipe(
        filter((x) => x.type === 'currentLang'),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.currentLang = res.payload;
      });
  }

  setStep(index: number) {
    this.step = index;
  }

  sortBy(status, columnName) {
    this.contentArray = [];
    this.returnedArray = [];

    this.sortStatus = !status;
    if (!this.sortStatus) {
      if (this.staticFilterKey[columnName] === 'createdDate') {
        this.data.tableBody = this.data.tableBody.sort((a, b) =>
          a.createdDate && b.createdDate
            ? a.createdDate > b.createdDate
            ? -1
            : 1
            : -1
        );
      } else {
        this.data.tableBody = this.data.tableBody.sort((a, b) =>
          a[this.staticFilterKey[columnName]].toLowerCase() >
          b[this.staticFilterKey[columnName]].toLowerCase()
            ? 1
            : -1
        );
      }
    } else if (this.sortStatus) {
      if (this.staticFilterKey[columnName] === 'createdDate') {
        this.data.tableBody = this.data.tableBody.sort((a, b) =>
          a.createdDate && b.createdDate
            ? a.createdDate < b.createdDate
            ? 1
            : -1
            : -1
        );
      } else {
        this.data.tableBody = this.data.tableBody.sort((a, b) =>
          a[this.staticFilterKey[columnName]].toLowerCase() <
          b[this.staticFilterKey[columnName]].toLowerCase()
            ? 1
            : -1
        );
      }
    }

    this.contentArray = new Array(this.data.tableBody.length).fill('');
    this.contentArray = this.contentArray.map(
      (v: string, i: number) => this.data.tableBody[i]
    );
    this.returnedArray = this.contentArray.slice(0, 10);
  }

  removeDetailsRowFunction(i, requestID) {
    if (requestID) {
      this.deletedIdsListForDetailsRow.push(requestID);
      this.removeDetailsRowIDs.emit(this.deletedIdsListForDetailsRow);
    }

    this.removeDetailsRowOutput.emit(i);
  }

  removePackagingRowFunction(i, requestID) {
    this.removePackagingRowOutput.emit(i);

    if (requestID) {
      this.deletedIdsListForPackaging.push(requestID);
      this.removePackagingRowIDs.emit(this.deletedIdsListForPackaging);
    }
  }

  editPackagingRowFunction(i) {
    this.editPackagingRowIDs.emit(i);
  }

  removeManufacturingRowFunction(i, requestID) {
    this.removeManufacturingRowOutput.emit(i);

    if (requestID) {
      this.deletedIdsListForManufacturing.push(requestID);
      this.removeManufacturingRowIDs.emit(this.deletedIdsListForManufacturing);
    }
  }

  editManufacturingRowFunction(i) {
    this.editManufacturingRowIDs.emit(i);
  }

  removeIngrediantDetailsRowFunction(childIndex, i, indexRow, idRequest) {
    this.removeIngrediantDetailsRowOutput.emit({childIndex, indexRow, i});

    if (idRequest) {
      this.deletedIdsListForIngrediant.push(idRequest);
      this.removeIngrediantDetailsIDs.emit(this.deletedIdsListForIngrediant);
    }
  }

  removeIngrediantDetailsRows(index) {
    this.removeIngrediantRowOutput.emit(index);
  }

  copyDetailsRowFunction(index, row) {
    this.copyDetailedRowOutput.emit(row);
  }

  editIngrediantDetailsRows(index) {
    this.editIngrediantRowOutput.emit(index);
  }

  removeProductInInvoicesRowsFunction(index) {
    this.removeProductInInvoicesRows.emit(index);
  }

  removeInvoiceFunction(index: number, item) {
    this.deleteInvoice.emit({index, item});
  }

  editProductInInvoicesRowsFunction(index: number, item) {
    this.editProductInInvoicesRows.emit({index, item});
  }

  editInvoiceFunction(index: number, item) {
    this.editInvoiceData.emit({index, item});
  }


  removeProductFromKitFunction(index) {
    this.removeProductFromKit.emit(index);
  }

  editDetailedRowFunction(i) {
    this.editDetailedRowOutput.emit(i);
  }

  setTheFilteredData(event) {
    if (event.keyForFilter.id) {
      if (event.filterRow.length > 0) {
        if (event.keyWordsForFilter) {
          if (event.keyForFilter.id === 'createdDate') {
            this.dataAfterFilters.map(
              (x) =>
                (x[event.keyForFilter.id] = new Date(
                  x[event.keyForFilter.id]
                ).toDateString())
            );
            if (
              this.dataAfterFilters.filter(
                (x) =>
                  x[event.keyForFilter.id] ===
                  event.keyWordsForFilter.toDateString()
              ).length > 0
            ) {
              this.dataAfterFilters = this.dataAfterFilters.filter(
                (x) =>
                  x[event.keyForFilter.id] ===
                  event.keyWordsForFilter.toDateString()
              );
            } else {
              this.showAlertForFailedAlert();
            }
          } else {
            if (
              this.dataAfterFilters.filter(
                (x) =>
                  x[event.keyForFilter.id] &&
                  x[event.keyForFilter.id]
                    .toLowerCase()
                    .includes(event.keyWordsForFilter.toLowerCase())
              ).length > 0
            ) {
              this.dataAfterFilters = this.dataAfterFilters.filter(
                (x) =>
                  x[event.keyForFilter.id] &&
                  x[event.keyForFilter.id]
                    .toLowerCase()
                    .includes(event.keyWordsForFilter.toLowerCase())
              );
            } else {
              this.showAlertForFailedAlert();
            }
          }
        } else {
          event.filterRow.map((x, i) => {
            if (i === 0) {
              if (event.keyForFilter.id === 'createdDate') {
                this.data.tableBody.map(
                  (y) =>
                    (y[this.staticFilterKey[x.columnName]] = new Date(
                      y[this.staticFilterKey[x.columnName]]
                    ).toDateString())
                );
                if (
                  this.data.tableBody.filter(
                    (y) =>
                      y[this.staticFilterKey[x.columnName]] ===
                      x.keyword.toDateString()
                  ).length > 0
                ) {
                  this.dataAfterFilters = this.data.tableBody.filter(
                    (y) =>
                      y[this.staticFilterKey[x.columnName]] ===
                      x.keyword.toDateString()
                  );
                } else {
                  this.showAlertForFailedAlert();
                }
              } else {
                if (
                  this.data.tableBody.filter(
                    (y) =>
                      y[this.staticFilterKey[x.columnName]] &&
                      y[this.staticFilterKey[x.columnName]]
                        .toLowerCase()
                        .includes(x.keyword.toLowerCase())
                  ).length > 0
                ) {
                  this.dataAfterFilters = this.data.tableBody.filter(
                    (y) =>
                      y[this.staticFilterKey[x.columnName]] &&
                      y[this.staticFilterKey[x.columnName]]
                        .toLowerCase()
                        .includes(x.keyword.toLowerCase())
                  );
                } else {
                  this.showAlertForFailedAlert();
                }
              }
            } else {
              if (event.keyForFilter.id === 'createdDate') {
                this.dataAfterFilters.map(
                  (y) =>
                    (y[this.staticFilterKey[x.columnName]] = new Date(
                      y[this.staticFilterKey[x.columnName]]
                    ).toDateString())
                );
                if (
                  this.dataAfterFilters.filter(
                    (y) =>
                      y[this.staticFilterKey[x.columnName]] ===
                      x.keyword.toDateString()
                  ).length > 0
                ) {
                  this.dataAfterFilters = this.dataAfterFilters.filter(
                    (y) =>
                      y[this.staticFilterKey[x.columnName]] ===
                      x.keyword.toDateString()
                  );
                } else {
                  this.showAlertForFailedAlert();
                }
              } else {
                if (
                  this.dataAfterFilters.filter(
                    (y) =>
                      y[this.staticFilterKey[x.columnName]] &&
                      y[this.staticFilterKey[x.columnName]]
                        .toLowerCase()
                        .includes(x.keyword.toLowerCase())
                  ).length > 0
                ) {
                  this.dataAfterFilters = this.dataAfterFilters.filter(
                    (y) =>
                      y[this.staticFilterKey[x.columnName]] &&
                      y[this.staticFilterKey[x.columnName]]
                        .toLowerCase()
                        .includes(x.keyword.toLowerCase())
                  );
                } else {
                  this.showAlertForFailedAlert();
                }
              }
            }
          });
        }
      } else {
        if (event.keyWordsForFilter) {
          if (event.keyForFilter.id === 'createdDate') {
            this.data.tableBody.map(
              (x) =>
                (x[event.keyForFilter.id] = new Date(
                  x[event.keyForFilter.id]
                ).toDateString())
            );
            if (
              this.data.tableBody.filter(
                (x) =>
                  x[event.keyForFilter.id] ===
                  event.keyWordsForFilter.toDateString()
              ).length > 0
            ) {
              this.dataAfterFilters = this.data.tableBody.filter(
                (x) =>
                  x[event.keyForFilter.id] ===
                  event.keyWordsForFilter.toDateString()
              );
            } else {
              this.showAlertForFailedAlert();
            }
          } else {
            if (
              this.data.tableBody.filter(
                (x) =>
                  x[event.keyForFilter.id] &&
                  x[event.keyForFilter.id]
                    .toLowerCase()
                    .includes(event.keyWordsForFilter.toLowerCase())
              ).length > 0
            ) {
              this.dataAfterFilters = this.data.tableBody.filter(
                (x) =>
                  x[event.keyForFilter.id] &&
                  x[event.keyForFilter.id]
                    .toLowerCase()
                    .includes(event.keyWordsForFilter.toLowerCase())
              );
            } else {
              this.showAlertForFailedAlert();
            }
          }
        } else {
          this.dataAfterFilters = [];
        }
      }
    }

    this.contentArray = new Array(
      this.dataAfterFilters.length > 0
        ? this.dataAfterFilters.length
        : this.data.tableBody.length
    ).fill('');
    this.contentArray = this.contentArray.map((v: string, i: number) =>
      this.dataAfterFilters.length > 0
        ? this.dataAfterFilters[i]
        : this.data.tableBody[i]
    );
    this.returnedArray = this.contentArray.slice(0, 10);
  }

  showAlertForFailedAlert() {
    this.alertNotificationStatus = true;

    setTimeout(() => {
      this.alertNotificationStatus = false;
    }, 3000);
  }

  editProduct(request) {
    const isTrackProduct = this.route.snapshot.routeConfig.data.animation;
    const editFrom = this.route.snapshot.routeConfig.path;

    if (editFrom === 'tell_do_variation') {
      this.router.navigate([
        `/new-request/tell_do_variation/${Number(request.ID)}/${
          isTrackProduct === 'track-request'
            ? 'Track'
            : isTrackProduct === 'rejected-request'
            ? 'FinalReject'
            : 'Request'
        }/${isTrackProduct === 'track-request' ? true : false}`,
      ]);
    } else if (editFrom === 'do_tell_variation') {
      this.router.navigate([
        `/new-request/do_tell_variation/${Number(request.ID)}/${
          isTrackProduct === 'track-request'
            ? 'Track'
            : isTrackProduct === 'rejected-request'
            ? 'FinalReject'
            : 'Request'
        }/${isTrackProduct === 'track-request' ? true : false}`,
      ]);
    } else if (editFrom === 'registration') {
      this.router.navigate([
        `/new-request/registration/${Number(request.ID)}/${
          isTrackProduct === 'track-request'
            ? 'Track'
            : isTrackProduct === 'rejected-request'
            ? this.rejectedType === 'Final'
              ? 'FinalReject'
              : 'CanBeAppealed'
            : 'Request'
        }`,
      ]);
    } else if (editFrom === 're-registration') {
      this.router.navigate([
        `/new-request/reregistration/${Number(request.ID)}/${
          isTrackProduct === 'track-request'
            ? 'Track'
            : isTrackProduct === 'rejected-request'
            ? this.rejectedType === 'Final'
              ? 'FinalReject'
              : 'CanBeAppealed'
            : 'Request'
        }`,
      ]);
    } else if (editFrom === 'legacy-products') {
      this.router.navigate([
        `/legacy-form/${Number(request.oldProductID)}/${
          isTrackProduct === 'track-request' ? 'Track' : 'Request'
        }`,
      ]);
    } else if (editFrom === 'legacy') {
      this.router.navigate([
        `/legacy-form/${Number(request.OLD_PRODUCT_ID)}/${
          isTrackProduct === 'track-request' ? 'Track' : 'Request'
        }`,
      ]);
    } else if (editFrom === 'approved-product') {
      this.router.navigate([
        `/new-request/registration/${Number(request.ID)}/${
          request.canEdit ? this.approvedType : 'approvedProduct'
        }`,
      ]);
    } else if (editFrom === 'rejected-product') {
      this.router.navigate([
        `/new-request/registration/${Number(request.ID)}/FinalReject`,
      ]);
    }
  }

  deleteProduct(request) {
    const editFrom = this.route.snapshot.routeConfig.path;
    if (editFrom === 'tell_do_variation') {
      this.removeDraftProduct.emit(request);
    } else if (editFrom === 'do_tell_variation') {
      this.removeDraftProduct.emit(request);
    } else if (editFrom === 'registration') {
      this.removeDraftProduct.emit(Number(request.ID));
    } else if (editFrom === 're-registration') {
      this.removeDraftProduct.emit(Number(request.ID));
    } else if (editFrom === 'legacy') {
      this.removeDraftProduct.emit(Number(request.ID));
    }

    this.dataAfterFilters = [];

    this.removeFilterKey = true;
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.contentArray.slice(startItem, endItem);
  }

  addBatch(notificationNumber) {
    this.inputService.publish({
      type: 'NotificationNumber',
      payload: notificationNumber,
    });
    this.router.navigateByUrl('/admin/adding-batch');
  }

  seenNotificationFunction(id) {
    this.seenNotification.emit(id);
  }

  deleteDraftrequest(requestId) {
    this.removeDraftProduct.emit(requestId);
  }

  removeIngredientfromPremixList(ingredient) {
    this.removeIngredientfromPremix.emit(ingredient);
  }

  removePremixfunction(premix) {
    this.removePremix.emit(premix);
  }

  editCustomReleaseRequestFunction(request) {
    this.editCustomReleaseRequest.emit(request);
  }

  replaceCustomReleaseRequestFunction(request) {
    this.replaceCustomReleaseRequest.emit(request);
  }

  choosePackagingRowFunction(packingRow) {
    this.choosePackagingRow.emit(packingRow);
  }

  chooseIngredientRowFunction(packingRow) {
    this.chooseIngredientRow.emit(packingRow);
  }

  chooseManufactureRowFunction(packingRow) {
    this.chooseManufactureRow.emit(packingRow);
  }

  onselectItemfunction(selectedapprovedItem) {
    this.selectItem.emit(selectedapprovedItem);
  }

  ondeleteItemDatafunction(index: number, item) {
    this.deleteItemData.emit({index, item});
  }

  ondeleteInvoiceDatafunction(index: number, item) {
    this.deleteInvoice.emit({index, item});
  }


  editDraft(request) {
    this.selectedDaraftITem.emit(request);
  }

  getBatchValue(index, value) {
    this.batchNumber.emit({index, value})
  }

  onFileSelect(index, value, event) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].type === 'application/pdf' && event.target.files[0].size <= 5000000) {
        const fileStructure = event.target.files[0].name;
        const reader = new FileReader();
        reader.readAsDataURL(fileStructure);
        reader.onload = (res: any) => {
          const targetResult = res.target.result
          this.fileSelect.emit({index, value, fileStructure, targetResult})
        }
      }
      ;
    }
  }

  //edit-view premix Task requirements
  editPremixfunction(premix) {
    this.editPremix.emit(premix);
  }

  viewPremixFunction(premix) {
    this.viewPremix.emit(premix);
  }

  editIngredientfromPremixList(ingredient) {
    this.editIngredientfromPremix.emit(ingredient);
  }

  removeBatchfromPremixList(batch) {
    this.removeBatchfromPremix.emit(batch);
  }

  //here is the function needed to add items over the selected invoice
  addItem(i, request) {
    this.additemEvent.emit({index: i, data: request});
  }
}

