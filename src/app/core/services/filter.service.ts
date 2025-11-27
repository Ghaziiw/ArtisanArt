import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private viewTypeSubject = new BehaviorSubject<'products' | 'artisans'>('products');

  viewType$ = this.viewTypeSubject.asObservable();

  setViewType(type: 'products' | 'artisans') {
    this.viewTypeSubject.next(type);
  }
}
