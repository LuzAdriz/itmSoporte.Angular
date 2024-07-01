import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable, of, switchMap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpOptions } from 'app/interfaces/generics/http-options';

@Injectable({
  providedIn: 'root'
})
export class HttpOptionService {

  constructor(private storage: StorageService) {}

  getHttpRequestOptions(originalOptions?: HttpOptions): Observable<HttpOptions> {
    return this.storage.getRaw('jwt-bearer').pipe(
      switchMap(jwtToken => {
        if (!jwtToken) {
          return of(originalOptions || ({} as HttpOptions));
        }

        const options: HttpOptions = { ...(originalOptions || {}) };

        options.headers = options.headers || new HttpHeaders();
        options.headers = options.headers.append(
          'Authorization',
          `Bearer ${jwtToken}`
        );
        return of(options);
      })
    );
  }
}
