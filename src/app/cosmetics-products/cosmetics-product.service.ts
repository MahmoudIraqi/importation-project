import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError, filter, distinctUntilChanged, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {InputService} from "../services/input.service";

@Injectable({
  providedIn: 'root'
})
export class CosmeticsProductService {

  secondApiURL = environment.secondApiURL;
  Token;

  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private inputService: InputService) {
    this.inputService.getInput$().pipe(
      filter(x => x.type === 'Token'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.Token = res.payload;
    });
  }

  getAllServicesBasedOnDeptId(departId, departSecId) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Token': this.Token
    });
    const options = {headers};

    return this.http.get(`${this.secondApiURL}Service/GetServiceImportReason/${departId}`, options)
      .pipe(map((res: any) => {
          return res;
        }),
        catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      setTimeout(() => {
        location.reload();
      }, 1500);


      return throwError(`Error! Please login again`);
    } else {
      return throwError(`Error! ${error.error.StatusMessage ? error.error.StatusMessage : error.error}`);
    }
  }

  editCustomReleaseRequest(request)
  {
   //this.customReleaseEdited=true;
    this.router.navigate([`/pages/cosmetics-product/inner/new-request/${Number(request.requestId)}`],
    { queryParams: {serviceAction: 'Edit' ,parentRequestId:request.requestId}});
    
  }
  replaceCustomReleaseRequest(request){
    this.router.navigate([`/pages/cosmetics-product/inner/new-request/${Number(request.requestId)}`],
    { queryParams: {serviceAction: 'Replace',parentRequestId:request.requestId }});
  }
}
