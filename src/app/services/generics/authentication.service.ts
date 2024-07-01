import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map, of } from "rxjs";
import { StorageService } from "./storage.service";
import { HttpService } from "./http.service";
import { HttpOptions } from "app/interfaces/generics/http-options";
import { Authentication } from "app/interfaces/generics/authentication";
import { Jwt } from "app/interfaces/generics/jwt";
import { UserData } from "app/interfaces/generics/user-data";
import { ChangePassword } from "app/interfaces/generics/change-password";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private storage: StorageService, private http: HttpService) {
    this.initialize();
  }

  private userInfoSubject = new BehaviorSubject<UserData | null>(null);
  userInfo$ = this.userInfoSubject.asObservable();

  private initialize(): void {
    this.storage.getRaw("user-info").subscribe((value) => {
      const user: UserData = { userName: value ?? '' };
      this.userInfoSubject.next(user);
    });
  }

  getUser(): Observable<UserData | null> {
    return this.userInfo$;
  }

  setUserData(user: UserData | null): void {
    this.userInfoSubject.next(user);
  }

  /** */
  login(userLogin: Authentication): Observable<boolean> {
    const options = {
      observe: "response",
      responseType: "json",
    } as HttpOptions;

    return this.http.post("Security/Authenticate", userLogin, options).pipe(
      map((response) => {
        if (response instanceof HttpResponse) {
          const dataJwt = { ...response.body } as Jwt;
          this.storage.set("jwt-bearer", dataJwt.token);
          this.storage.set("user-info", userLogin.userName);
          return true;
        } else {
          this.storage.clear();
          return false;
        }
      })
    );
  }

  /** */
  changePassword(changePass: ChangePassword): Observable<any> {
    const options = {
      observe: "response",
      responseType: "json",
    } as HttpOptions;
    return this.http.put("Security/ChangePassword", changePass, options);
  }
}
