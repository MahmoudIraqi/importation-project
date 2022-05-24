import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {
  map,
  catchError,
  filter,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import {InputService} from './input.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Inspection} from '../comments/comments.model';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private _isLoggedIn: boolean;
  apiBaseUrl = environment.apiURL;
  secondApiURL = environment.secondApiURL;
  thirdApiURL = environment.thirdApiURL;
  cloudServerApiURL = environment.cloudServerApiURL;
  cloudValidationServerApiURL = environment.cloudValidationServerApiURL;
  Token;

  // loginAPIURL = environment.loginAPIURL;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private inputService: InputService
  ) {
    this.inputService
      .getInput$()
      .pipe(
        filter((x) => x.type === 'Token'),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.Token = res.payload;
      });
  }

  loginAPIToken(data) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
    });
    const options = {headers};

    const newStructure = {
      UserName: data.username,
      UserPassword: data.password,
    };

    const JSONData = JSON.stringify(newStructure);

    return this.http
      .post(`${this.cloudServerApiURL}PortalLogin/Login`, JSONData, options)
      .pipe(
        distinctUntilChanged(),
        tap((res: any) => {
          if (res) {
            this.isLoggedIn = true;
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  logoutAPIToken(token) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: token,
    });
    const options = {headers};

    return this.http
      .post(`${this.cloudServerApiURL}PortalLogin/Logout`, {token: token}, options)
      .pipe(
        map((res: any) => {
          this.isLoggedIn = false;
          return res;
        }),
        catchError(this.handleError)
      );
  }

  get isLoggedIn() {
    return this._isLoggedIn;
  }

  set isLoggedIn(v) {
    this._isLoggedIn = v;
  }

  getDashboardData() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http.get(`${this.apiBaseUrl}Lookups/Dashboard`, options).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getAllPortsLookUp() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}BillOfLading/ports`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllInvoiceItemTypes() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http.get(`${this.cloudServerApiURL}Invoice/itemTypes`, options).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getAllImportReason() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Invoice/importReasons`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getImportReasonByItemId(itemId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Invoice/importReasons/${itemId}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getCompanyProfiles() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Company/GetCompanyProfiles`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllDepartmentsInSys() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Department/GetDepartmentsData`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllIngredient() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http.get(`${this.cloudServerApiURL}Item/Ingredients`, options).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getIngredientByRange(start, end) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Item​/Ingredients/${start}/${end}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllPackagingList() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http.get(`${this.cloudServerApiURL}Item/PackingTypes`, options).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getAllSrcRowMaterial() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Item/GetSrcRawMaterials`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllProductManufacture() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Product/ProductManufacture`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllReleaseType() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}RequestRelease/ReleaseType`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getSharedCountries() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http.get(`${this.cloudServerApiURL}Shared/Countries`, options).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getSharedCurrencies() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http.get(`${this.cloudServerApiURL}Shared/Currencies`, options).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getAllUnitOfMeasure() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Shared/unitsOfMeasurement`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getCompanyProfileLookUp(page, companyProfile, filterText) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.apiBaseUrl}Lookups/CompanyProfile?pageNo=${page}&pageSize=15000&companyprofileid=${companyProfile}&searchName=${filterText}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  createProductRequest(data) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Token': this.Token,

    });

    const options = {headers};

    data = JSON.stringify(data);

    return (
      this.http
        .post(
          `${this.cloudServerApiURL}RequestRelease/SaveRequestRelease`,
          data,
          options
        )
        .pipe(
          map((res: any) => {
            return res;
          }),
          catchError((err) => {
            return throwError(new Error(err.error.title)
            );
          })
        ));
  }

  submitRequest(data) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Token': this.Token,
      'Access-Control-Allow-Origin': '*'
    });

    const options = {headers};

    data = JSON.stringify(data);

    return this.http
      .post(
        `${this.cloudServerApiURL}RequestRelease/SubmitRequestRelease`,
        data,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteDraftRequest(requestId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Requests/DeleteRequest/${requestId}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getInvoicesByBilOfLanding(bolId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}Invoice/InvoicesByBilOfLading/${bolId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getIngredientCount(bolId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Item/Ingredients/Count`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getInvoiceItemForView(invoiceId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Item/invoiceItems/${invoiceId}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getInvoiceApprovedItem(invoiceId, approveNo) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}Item/invoiceItems/${invoiceId}/${approveNo}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getRequestDetails(requestId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Requests/${requestId}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllRequest() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http.get(`${this.cloudServerApiURL}Requests`, options).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteRequestDetails(requestId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .post(`${this.cloudServerApiURL}Requests/DeleteRequest/${requestId}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  setRequestAsDraft(event) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    const JSONData = JSON.stringify(event);

    return this.http
      .post(`${this.apiBaseUrl}Requests/SaveRequest`, JSONData, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  setSubmissionRequest(event) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    const JSONData = JSON.stringify(event);

    return this.http
      .post(`${this.apiBaseUrl}Requests/SubmitRequest`, JSONData, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getRequestCount(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}Requests/GetAllRequestsCount/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllDraftRequestCount(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}RequestRelease/GetDraftRequestReleasForView/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getCompanyDraftRequestsCount(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}RequestRelease/GetDraftRequestReleasCount/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getCompanyApprovedRequestsCount(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}RequestRelease/GetApprovedRequestReleasCount/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getTotalRequestsCount(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}RequestRelease/GetAllRequestReleasCount/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getCompanyPendingRequestsCount(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}RequestRelease/GetPendingRequestReleasCount/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllApprovedRequestCount(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}RequestRelease/GetApprovedRequestReleasForView/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllRejectedRequestCount(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}RequestRelease/GetRejectedRequestReleasForView/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllPendingRequestCount(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}RequestRelease/GetPendingRequestReleasForView/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getDraftRequestForView(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}Requests/GetDraftRequestsForView/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getApprovedRequestForView(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}Requests/GetApprovedRequestsForView/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getRejectedRequestForView(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}Requests/GetRejectedRequestsForView/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPendingRequestForView(companyRoleId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}Requests/GetPendingRequestsForView/${companyRoleId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getProductWithNotificationNumberList(notificationNumber) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}Product/GetProductByNotificationsNumber/${notificationNumber}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getRequestWithId(id) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}RequestRelease/GetReleaseRequestData/${id}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  // getTrackTypeLookUp() {
  //   const headers = new HttpHeaders({
  //     'Content-type': 'application/json',
  //     'Token': this.Token
  //   });
  //   const options = {headers};
  //
  //   return this.http.get(`${this.apiBaseUrl}Lookups/tracktype`, options)
  //     .pipe(map((res: any) => {
  //         return res;
  //       }),
  //       catchError(this.handleError));
  // }
  //
  // getApprovedProductsList() {
  //   const headers = new HttpHeaders({
  //     'Content-type': 'application/json',
  //     'Token': this.Token
  //   });
  //   const options = {headers};
  //
  //   return this.http.get(`${this.apiBaseUrl}Product/GetNotificationList?Type=approved&pageNo=1&pageSize=5000`, options)
  //     .pipe(map((res: any) => {
  //         return res;
  //       }),
  //       catchError(this.handleError));
  // }
  //
  // getApprovedProductsWithCommentsFromLabsList() {
  //   const headers = new HttpHeaders({
  //     'Content-type': 'application/json',
  //     'Token': this.Token
  //   });
  //   const options = {headers};
  //
  //   return this.http.get(`${this.apiBaseUrl}Product/GetNotificationList?Type=flagLab&pageNo=1&pageSize=5000`, options)
  //     .pipe(map((res: any) => {
  //         return res;
  //       }),
  //       catchError(this.handleError));
  // }
  //
  // getApprovedProductsWithCommentsFromRegList() {
  //   const headers = new HttpHeaders({
  //     'Content-type': 'application/json',
  //     'Token': this.Token
  //   });
  //   const options = {headers};
  //
  //   return this.http.get(`${this.apiBaseUrl}Product/GetNotificationList?Type=flagReg&pageNo=1&pageSize=5000`, options)
  //     .pipe(map((res: any) => {
  //         return res;
  //       }),
  //       catchError(this.handleError));
  // }
  //
  // getApprovedProductsWithCommentsFromVariationList() {
  //   const headers = new HttpHeaders({
  //     'Content-type': 'application/json',
  //     'Token': this.Token
  //   });
  //   const options = {headers};
  //
  //   return this.http.get(`${this.apiBaseUrl}Product/GetNotificationList?Type=flagVariation&pageNo=1&pageSize=5000`, options)
  //     .pipe(map((res: any) => {
  //         return res;
  //       }),
  //       catchError(this.handleError));
  // }
  //
  // getApprovedHoldProductsFromLabList() {
  //   const headers = new HttpHeaders({
  //     'Content-type': 'application/json',
  //     'Token': this.Token
  //   });
  //   const options = {headers};
  //
  //   return this.http.get(`${this.apiBaseUrl}Product/GetNotificationList?Type=holdLab&pageNo=1&pageSize=5000`, options)
  //     .pipe(map((res: any) => {
  //         return res;
  //       }),
  //       catchError(this.handleError));
  // }
  //
  // getApprovedHoldProductsFromRegList() {
  //   const headers = new HttpHeaders({
  //     'Content-type': 'application/json',
  //     'Token': this.Token
  //   });
  //   const options = {headers};
  //
  //   return this.http.get(`${this.apiBaseUrl}Product/GetNotificationList?Type=holdReg&pageNo=1&pageSize=5000`, options)
  //     .pipe(map((res: any) => {
  //         return res;
  //       }),
  //       catchError(this.handleError));
  // }
  //
  // getApprovedHoldProductsFromVariationList() {
  //   const headers = new HttpHeaders({
  //     'Content-type': 'application/json',
  //     'Token': this.Token
  //   });
  //   const options = {headers};
  //
  //   return this.http.get(`${this.apiBaseUrl}Product/GetNotificationList?Type=holdVariation&pageNo=1&pageSize=5000`, options)
  //     .pipe(map((res: any) => {
  //         return res;
  //       }),
  //       catchError(this.handleError));
  // }
  //
  getNotificationLogsList() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.apiBaseUrl}Lookups/notificationlog`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  GetNotificationsList() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Notification/GetNotificationsList`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  GetNotificationCount() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Notification/GetNotificationCount`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  setSeenNotificationByID(id) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .post(`${this.apiBaseUrl}product/SeenNotificaion?id=${id}`, {}, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  GetAttachments(serviceId, attachmentTabId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Attachments/GetAttachmentTypes`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  //

  setAttachmentFile(event) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: localStorage.getItem('privateData'),
    });
    const options = {headers};

    const JSONData = JSON.stringify(event);

    return this.http
      .post(
        `${this.cloudServerApiURL}Attachments/UploadAttachment`,
        JSONData,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }


  uploadOnOpenText(event) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    const JSONData = JSON.stringify(event);

    return this.http
      .post(`${this.cloudServerApiURL}Attachments/UploadAttachment`, JSONData, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAttachmentFileByID(requestID, attachmentName) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.apiBaseUrl}product/GetAttachment?requestId=${requestID}&attachmentName=${attachmentName}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  AddNewPremix(data) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });

    const options = {headers};

    data = JSON.stringify(data);

    return (
      this.http
        .post(`${this.secondApiURL}Premix/SavePremix`, data, options)
        .pipe(
          map((res: any) => {
            return res;
          }),
          catchError(this.handleError)
        )
    );
  }

  validateNotificationNumberForPremix(notificationNumber): any {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Product/ValidateNotificationsNumber/${notificationNumber}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPremixList() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Premix/GetListOfPremix`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPremixListofFunctions() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Premix/GetListOfFunction`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPermixById(id) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.secondApiURL}Premix/GetPremixById/${id}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  //here is the function needed to get the uploaded attachment using uploaded request id
  GetUploadedAttach(apploadedID) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      // Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}Attachments/GetDocumentAsBase64/${apploadedID}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  //here is the function needed to retrive data
  GetSaveSubmitData(SelecteDRequestID: any) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Approval/GetApprovalRequestData/${SelecteDRequestID}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getManufactureCompanies() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Lookup/GetLkupManufactory`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  removePremix(id) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .post(`${this.cloudServerApiURL}Premix/DeltePremix/${id}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPackingTypes() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http.get(`${this.cloudServerApiURL}Item/PackingTypes`, options).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  //
  // getVariablesPricesLookUp() {
  //   const headers = new HttpHeaders({
  //     'Content-type': 'application/json',
  //     'Token': this.Token
  //   });
  //   const options = {headers};
  //
  //   return this.http.get(`${this.apiBaseUrl}Lookups/variables`, options)
  //     .pipe(map((res: any) => {
  //         return res;
  //       }),
  //       catchError(this.handleError));
  // }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      setTimeout(() => {
        location.reload();
      }, 1500);

      return throwError(`Error! Please login again`);
    } else {
      return throwError(
        `Error! ${
          error.error.StatusMessage ? error.error.StatusMessage : error.error
        }`
      );
    }
  }

  GetCompanyInfo(companyProfileId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}company/getCompanyInfo/${companyProfileId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  GetApprovalInvoice(approvalNo, serviceId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}approval/getApprovalInvoice/${approvalNo}/${serviceId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  //////////////imported verna
  postRequestCountImported(companyProfileId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .post(
        `${this.cloudServerApiURL}Requests/GetAllRequestsCount/${companyProfileId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postImportedApprovedRequestsCount(companyProfileId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .post(
        `${this.cloudServerApiURL}Requests​/GetApprovedRequestCount`,
        companyProfileId,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postImportedAllRequest(companyProfileId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .post(
        `${this.cloudServerApiURL}Requests​/GetAllRequestCount`,
        companyProfileId,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postImportedPendingRequestsCount(companyProfileId, serviceId, serviceTypeId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .post(
        `${this.cloudServerApiURL}Requests​/GetPendingRequestCount/${companyProfileId}${serviceTypeId}${serviceId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postImportedRejectedRequestCount(companyProfileId, serviceId, serviceTypeId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .post(
        `${this.cloudServerApiURL}Requests​/GetRejectedRequestCount/${companyProfileId}${serviceTypeId}${serviceId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postImportedPendingRequestForView(importedpending) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};
    //  = JSON.stringify(importedpending);
    // const  importedpendingconverted ={
    //     "serviceTypeId": 0,
    //     "companyRoleId": 0,
    //     "companyProfileId": 0
    //   }

    return this.http
      .post(
        `${this.cloudServerApiURL}Requests/GetPendingRequestsForView`,
        importedpending,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postImportedRequestCount(companyProfileId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Requests/GetAllRequestsForView`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postImportedApprovedRequestForView(importedApproved) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};
    const importedoptionconverted = JSON.stringify(importedApproved);
    return this.http
      .post(
        `${this.cloudServerApiURL}Requests/GetApprovedRequestsForView`,
        importedoptionconverted,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postImportedDraftRequestForView(importedoption) {

    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    const importedoptionconverted = JSON.stringify(importedoption);

    return this.http
      .post(
        `${this.cloudServerApiURL}Requests/GetDraftRequestsForView`,
        importedoptionconverted,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  postImportedRejectedRequestForView(companyProfileId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .post(
        `${this.cloudServerApiURL}Requests/GetRejectedRequestsForView`,
        companyProfileId,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  ApprovalImportedRequest(data) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });

    const options = {headers};

    data = JSON.stringify(data);

    return this.http
      .post(`${this.cloudServerApiURL}Approval/SaveRequestApproved`, data, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  //here is the fucntion needed to get all added roles based on company id
  GetAllRoles(id: any) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};
    return this.http
      .get(`${this.cloudServerApiURL}Company/GetCompanyRoles/${id}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  //here is the function needed to get all added servive list base on company id
  GetAllServiceList(id: any) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};
    return this.http
      .get(`${this.cloudServerApiURL}Company/GetCompanyServices/${id}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  //here is the function needed to add roles and services
  AssignRolesToServices(body) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });

    const options = {headers};

    body = JSON.stringify(body);

    return this.http
      .post(`${this.cloudServerApiURL}Company/SaveRoleServices`, body, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  //here is the function needed to add role for a selected user
  AddRoleUser(body) {
    //Company/SaveRoleUser
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });

    const options = {headers};

    body = JSON.stringify(body);

    return this.http
      .post(`${this.cloudServerApiURL}Company/SaveRoleUser`, body, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getRequestComments(RequestId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(`${this.cloudServerApiURL}Requests/GetStepComments/${RequestId}`, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getStepComments(requestId): Observable<Inspection.IStepComments> {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};
    return this.http
      .post(
        `${this.thirdApiURL}Inspection/GetStepComments`,
        {requestId},
        options
      )
      .pipe(
        map(
          (res: any) => ({
            ...res,
            jsonRequestComments: JSON.parse(res.jsonRequestComments),
          }),
          catchError(this.handleError)
        )
      );
  }

  //here is the function needed to save approval
  SaveApproval(body) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    debugger;
    const options = {headers};
    body = JSON.stringify(body);
    return this.http
      .post(`${this.cloudServerApiURL}Approval/SaveRequestApproved`, body, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(new Error(err.error.title)
          );
        })
      );
  }

  getWithinIncludedBols() {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Token': this.Token
    });
    const options = {headers};
    return this.http.get(`${this.cloudServerApiURL}BillOfLading/GetWithinIncludedBols`)
      .pipe(map((res: any) => {
          return res;
        }),
        catchError(this.handleError));
  }

  getBillOfLading(BolNo: string) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Token': this.Token
    });
    const options = {headers};
    return this.http.get(`${this.cloudServerApiURL}BillOfLading/GetBillOfLading/${BolNo}`)
      .pipe(map((res: any) => {
          return res;
        }),
        catchError(this.handleError));
  }

  getWithinIncludedInvoices(BolNo: string) {

    return this.http.get(`${this.cloudServerApiURL}Invoice/GetWithInIncludedInvoices/${BolNo}`)

      .pipe(map((res: any) => {

          return res;

        }),

        catchError(this.handleError));

  }

  getInvoiceByInvoiceNo(InvoiceNo: string) {

    return this.http.get(`${this.cloudServerApiURL}Invoice/InvoiceByInvoiceNo/${InvoiceNo}`)

      .pipe(map((res: any) => {

          return res;

        }),

        catchError(this.handleError));

  }

  //here is the function needed to submit the approval request for a service

  SubmitApprovalRequestforService(body) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};
    body = JSON.stringify(body);
    return this.http

      //.post(`${this.cloudServerApiURL}Approval/SubmitRequestApproved`, body, options)
      .post(`${this.cloudValidationServerApiURL}Approval/SubmitRequestApproved`, body, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  //get attachment by Id
  GetDocumentAsBase64(attachId): any {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http.get(`${this.cloudServerApiURL}Attachments/GetDocumentAsBase64/${attachId}`, {responseType: 'json'})

      .pipe(map((res: any) => {
          return res;
        }),

        catchError(this.handleError));

  }

  //here is the function needed to get the uploaded attachments under the fetched request
  GetUploadedAttachments(RequestID) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.apiBaseUrl}Requests/GetAttachmentsByRequestId/${RequestID}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  replaceForLost(data) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};
    return (
      this.http.post(`${this.cloudServerApiURL}Requests/ReplacementForLost`, data, options)
        .pipe(
          map((res: any) => {
            return res;
          }),
          catchError(this.handleError)
        )
    );
  }

  GetAttachmentTypes(syslkupAttachTabId, lkupServicesId) {

    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Token: this.Token,
    });
    const options = {headers};

    return this.http
      .get(
        `${this.cloudServerApiURL}Attachments/GetAttachmentTypes/${syslkupAttachTabId},${lkupServicesId}`,
        options
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
}
