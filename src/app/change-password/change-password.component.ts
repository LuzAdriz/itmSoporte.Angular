import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ChangePassword } from "app/interfaces/generics/change-password";
import { AuthenticationService } from "app/services/generics/authentication.service";
import { NotificationsService } from "app/services/generics/notifications.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  changePassForm: FormGroup;
  loading = false;
  showPassword: boolean[] = [false, false, false];

  constructor(
    private formBuilder: FormBuilder,
    private notification: NotificationsService,
    private authService: AuthenticationService
  ) {
    this.changePassForm = this.formBuilder.group({
      OldPassword: ["", Validators.required],
      NewPassword: ["", Validators.required],
      ConfirmNewPassword: ["", Validators.required],
    });
  }

  get passControl(): AbstractControl | null {
    return this.changePassForm.get("OldPassword");
  }

  get newPassControl(): AbstractControl | null {
    return this.changePassForm.get("NewPassword");
  }

  get confirmNewPassControl(): AbstractControl | null {
    return this.changePassForm.get("ConfirmNewPassword");
  }

  ngOnInit(): void {}

  changePassword() {
    this.loading = true;
    this.changePassForm.disable();
    const changePass = this.changePassForm.value as ChangePassword;
    this.showPassword = [false, false, false];
    this.authService.changePassword(changePass).subscribe(
      (success) => {
        console.log(success);
        this.loading = false;
        this.changePassForm.enable();
        this.changePassForm.reset();
        this.notification.showNotification("success", success.body.response);
      },
      (error) => {
        this.loading = false;
        this.changePassForm.enable();
        var errorMessage = error.error.message ?? error.error.ErrorDetails;
        this.notification.showNotification("danger", errorMessage);
      }
    );
  }

  togglePasswordVisibility(pos: number): void {
    const showValue = this.showPassword[pos];

    this.showPassword[pos] = showValue ? false : true;
  }
}
