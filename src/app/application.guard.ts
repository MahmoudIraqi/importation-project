import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute, Router, CanDeactivate} from '@angular/router';
import {Observable} from 'rxjs';
import {FormService} from './services/form.service';
import {InputService} from './services/input.service';
import {distinctUntilChanged, filter} from 'rxjs/operators';
import {HomeContainerComponent} from './home-container/home-container.component';

@Injectable({
  providedIn: 'root'
})
export class ApplicationGuard implements CanActivate {
  Token;

  constructor(private getService: FormService, private readonly route: ActivatedRoute,
              private inputService: InputService, private readonly routing: Router) {

    inputService.getInput$().pipe(
      filter(x => x.type === 'Token'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.Token = res.payload;
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.getService.isLoggedIn) {
      return true;
    } else {
      const token = localStorage.getItem('privateData');
      this.getService.logoutAPIToken(token).subscribe((res: any) => {
      });
      localStorage.setItem('privateData', '');
      this.routing.navigateByUrl('/login');
      return false;
    }
  }

}
