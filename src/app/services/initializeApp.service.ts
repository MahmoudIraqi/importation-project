// import { Observable } from 'rxjs';
import { InputService } from './input.service';
import { Router } from '@angular/router';
import { FormService } from './form.service';

export const initializeAppFactory = (inputSvc: InputService, routing: Router, formSvc: FormService): () => boolean => {
    const companyData = localStorage.getItem("CompanyData");
    const token = localStorage.getItem("privateData");
    
    if (companyData && token) {
        inputSvc.publish({ type: 'CompanyData', payload: JSON.parse(companyData) });
        inputSvc.publish({type: 'Token', payload: token});
        formSvc.isLoggedIn = true;
    } else {
        routing.navigateByUrl('/login');
    }
    return () => true;
}