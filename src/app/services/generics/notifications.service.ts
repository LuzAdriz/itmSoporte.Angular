import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { DialogConfirmComponent } from "app/components/dialog-confirm/dialog-confirm.component";
declare var $: any;

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  constructor(private dialog: MatDialog) {}

  showNotification(_type: string, _message: string | string[]) {
    const types = ["", "info", "success", "warning", "danger"];
    const isArray = Array.isArray(_message);
    $.notify(
      {
        icon: "notifications",
        message: isArray ? _message.join("<br><br>") : _message,
      },
      {
        type: types.find((t) => t === _type),
        timer: 200,
        placement: {
          from: "bottom",
          align: "left",
        },
        template:
          '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }

  openConfirmDialog(message?: string): Observable<any> {
    return this.dialog
      .open(DialogConfirmComponent, {
        data: {
          message: message,
          buttonText: {
            ok: "SI",
            cancel: "NO",
          },
        },
      })
      .afterClosed();
  }
}
