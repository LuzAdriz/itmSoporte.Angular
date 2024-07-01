import { Injectable } from '@angular/core';
import { HttpOptions } from 'app/interfaces/generics/http-options';
import { Observable } from 'rxjs';
import { HttpService } from '../generics/http.service';

@Injectable({
  providedIn: 'root'
})
export class DepartamentService {

  constructor(private http : HttpService) { }

  getAll(): Observable<any> {
    const options = {
      observe: "response",
      responseType: "json",
    } as HttpOptions;
    return this.http.get("Department/FindAll", options);
  }
}
