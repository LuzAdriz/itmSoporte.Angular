import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  get<T>(inputName: string): Observable<T> {
    return this.getRaw(inputName);
  }

  getRaw(inputName: string): Observable<any> {
    const storedValue = sessionStorage.getItem(inputName);
    return storedValue ? of(JSON.parse(storedValue)) : of('');
  }

  set(inputName: any, value: any): Observable<any> {
    sessionStorage.setItem(inputName, JSON.stringify(value));
    return of(value);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
