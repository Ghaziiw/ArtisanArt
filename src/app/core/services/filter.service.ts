import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private viewTypeSubject = new BehaviorSubject<'products' | 'artisans'>('products');
  private searchQuerySubject = new BehaviorSubject<string>('');

  viewType$ = this.viewTypeSubject.asObservable();
  searchQuery$ = this.searchQuerySubject.asObservable();

  setViewType(type: 'products' | 'artisans') {
    this.viewTypeSubject.next(type);
  }

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  getCurrentViewType(): 'products' | 'artisans' {
    return this.viewTypeSubject.value;
  }

  getCurrentSearchQuery(): string {
    return this.searchQuerySubject.value;
  }
}