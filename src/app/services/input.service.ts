import {Observable, ReplaySubject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class InputService {
  private subject = new ReplaySubject<any>();

  constructor() {
  }

  publish(inputAction) {
    this.subject.next(inputAction);
  }

  getInput$(): Observable<any> {
    return this.subject.asObservable().pipe(distinctUntilChanged());
  }
}
