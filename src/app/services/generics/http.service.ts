import { Injectable } from "@angular/core";
import { Observable, catchError, map, switchMap, throwError } from "rxjs";
import { StorageService } from "./storage.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { HttpOptionService } from "./http-option.service";
import { HttpOptions } from "app/interfaces/generics/http-options";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private baseApiUrl = environment.apiUrl;
  constructor(
    private httpClient: HttpClient,
    private httpOptionsService: HttpOptionService,
    private storage: StorageService,
    private router: Router,
    private dialogRef: MatDialog
  ) {}

  private handleError(error: any): Observable<any> {
    if (error.status === 401) {
      this.router.navigate([""], { queryParams: { sessionExpired: true } });
      this.storage.clear();
      this.dialogRef.closeAll();
    }
    return throwError(error);
  }

  /** */
  get<T>(url: string, options?: HttpOptions): Observable<T> {
    console.log("url get", url);
    return this.httpOptionsService.getHttpRequestOptions(options).pipe(
      switchMap((securedOptions) =>
        this.httpClient.get<T>(
          `${this.baseApiUrl}${url}`,
          securedOptions as any
        )
      ),
      map((httpEvent: any) => httpEvent),
      catchError((error) => this.handleError(error))
    );
  }

  /** */
  post<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this.httpOptionsService.getHttpRequestOptions(options).pipe(
      switchMap((securedOptions) =>
        this.httpClient.post<T>(
          `${this.baseApiUrl}${url}`,
          body,
          securedOptions as any
        )
      ),
      map((httpEvent: any) => httpEvent),
      catchError((error) => this.handleError(error))
    );
  }

  /** */
  put<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this.httpOptionsService.getHttpRequestOptions(options).pipe(
      switchMap((securedOptions) =>
        this.httpClient.put<T>(
          `${this.baseApiUrl}${url}`,
          body,
          securedOptions as any
        )
      ),
      map((httpEvent: any) => httpEvent),
      catchError((error) => this.handleError(error))
    );
  }
}
