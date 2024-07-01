import { Injectable } from "@angular/core";
import { HttpOptions } from "app/interfaces/generics/http-options";
import { Observable } from "rxjs";
import { HttpService } from "../generics/http.service";
import InformationRequestSearchE from "app/interfaces/search/information-request-search";
import { InformationRequestE } from "app/interfaces/information-request";

@Injectable({
  providedIn: "root",
})
export class InformationRequestService {
  constructor(private http: HttpService) {}

  /** */
  private buildQueryString(params: InformationRequestSearchE): string {
    const queryStringParams = [];
    const { UserCreated, Status, StartDate, EndDate, Pagination } = params;
    const searchProperties = { UserCreated, Status, StartDate, EndDate };
    const paginationProperties = Pagination ? { ...Pagination } : {};
    const search = {
      ...searchProperties,
      ...paginationProperties,
    };

    for (const key in search) {
      if (!search.hasOwnProperty(key)) continue;

      let value = encodeURIComponent(search[key] || "").toString();
      let hasValue = search[key] !== undefined && search[key] !== null;
      if (hasValue) queryStringParams.push(`${key}=${value}`);
    }

    return queryStringParams.join("&");
  }

  /** */
  getRequestHeader(paramsSearch: InformationRequestSearchE): Observable<any> {
    const queryParams = this.buildQueryString(paramsSearch);

    const options = {
      observe: "response",
      responseType: "json",
    } as HttpOptions;
    const urlEndpoint = "RequestHeader/FindByFields";
    const url = `${urlEndpoint}${queryParams ? "?" + queryParams : ""}`;

    return this.http.get(url, options);
  }

  /** */
  inserRequestE(requestE: FormData): Observable<any> {
    const options = {
      observe: "response",
      responseType: "json",
    } as HttpOptions;

    return this.http.post("RequestHeader/Insert", requestE, options);
  }

  /** */
  closeRequestE(idRequest: number): Observable<any> {
    const options = {
      observe: "response",
      responseType: "json",
    } as HttpOptions;
    const body = { IdRequest: idRequest };
    return this.http.put("RequestHeader/Close", body, options);
  }

  findRequestById(idRequest: number): Observable<any> {
    const options = {
      observe: "response",
      responseType: "json",
    } as HttpOptions;
    const body = { IdRequest: idRequest };
    return this.http.post("RequestHeader/FindById", body, options);
  }

  findDetailsByRequestId(idRequest: number): Observable<any> {
    const options = {
      observe: "response",
      responseType: "json",
    } as HttpOptions;
    const body = { IdRequest: idRequest };
    return this.http.post("RequestDetails/FindByRequest", body, options);
  }

  inserRequestD(requestD: FormData): Observable<any> {
    const options = {
      observe: "response",
      responseType: "json",
    } as HttpOptions;

    return this.http.post("RequestDetails/Insert", requestD, options);
  }
}
