import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Authentication } from "app/interfaces/generics/authentication";
import { UserData } from "app/interfaces/generics/user-data";
import { AuthenticationService } from "app/services/generics/authentication.service";
import { NotificationsService } from "app/services/generics/notifications.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private notification: NotificationsService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      userName: ["prueba@prueba.com", Validators.required],
      password: ["Prueba1234*", Validators.required],
    });
  }

  ngOnInit(): void {}

  get usernameControl(): AbstractControl | null {
    return this.loginForm.get("userName");
  }

  get passwordControl(): AbstractControl | null {
    return this.loginForm.get("password");
  }

  login() {
    this.loading = true;
    this.loginForm.disable();
    const userData = this.loginForm.value as Authentication;

    this.authService.login(userData).subscribe(
      (response) => {
        this.loading = false;
        this.loginForm.enable();
        this.loginForm.reset();
        this.router.navigate(["/information-request"]);
        this.notification.showNotification(
          "success",
          "Inicio de sesión exitoso... ¡Bienvenido!"
        );
      },
      (error) => {
        this.loading = false;
        this.loginForm.enable();
        var errorMessage = error.error.message;
        this.notification.showNotification("danger", errorMessage);
      }
    );
  }
}
