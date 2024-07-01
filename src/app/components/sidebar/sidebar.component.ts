import { Component, OnDestroy, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationsService } from "app/services/generics/notifications.service";
import { StorageService } from "app/services/generics/storage.service";
import { AuthenticationService } from "../../services/generics/authentication.service";
import { UserData } from "app/interfaces/generics/user-data";
import { Observable } from "rxjs";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class?: string;
  isLogout?: boolean;
}
export const ROUTES: RouteInfo[] = [
  // { path: "/dashboard", title: "Dashboard", icon: "dashboard" },
  { path: "/change-password", title: "Cambiar Contraseña", icon: "sync_lock" },
  {
    path: "/information-request",
    title: "Gestión Solicitudes",
    icon: "help",
  },
  // { path: "/table-list", title: "Table List", icon: "content_paste" },
  // { path: "/typography", title: "Typography", icon: "library_books" },
  // { path: "/icons", title: "Icons", icon: "bubble_chart" },
  // { path: "/maps", title: "Maps", icon: "location_on" },
  // { path: "/notifications", title: "Notifications", icon: "notifications" },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems = ROUTES.slice();
  userData$: Observable<UserData | null>;

  constructor(
    private notifications: NotificationsService,
    private router: Router,
    private storege: StorageService,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    this.userData$ = this.auth.getUser();
    this.userData$.subscribe();
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  logout(): void {
    const message = "¿Seguro desea cerrar sesión?";
    this.notifications
      .openConfirmDialog(message)
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.router.navigate(["/login"]);
        this.storege.clear();
      });
  }
}
