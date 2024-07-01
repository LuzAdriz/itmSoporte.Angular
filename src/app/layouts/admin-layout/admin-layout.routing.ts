import { Routes } from "@angular/router";
import { ChangePasswordComponent } from "app/change-password/change-password.component";
import { InformationRequestComponent } from "app/information-request/information-request.component";

export const AdminLayoutRoutes: Routes = [
  { path: "change-password", component: ChangePasswordComponent },
  { path: "information-request", component: InformationRequestComponent },
];
