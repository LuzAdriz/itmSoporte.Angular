import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { InformationRequestE } from "app/interfaces/information-request";
import InformationRequestSearchE from "app/interfaces/search/information-request-search";
import PaginationGet from "app/interfaces/search/pagination-get";
import { NotificationsService } from "app/services/generics/notifications.service";
import { InformationRequestService } from "app/services/information-request/information-request.service";
import { RequestFormComponent } from "./request-form/request-form.component";
import { DatePipe } from "@angular/common";
import { catchError, of, switchMap } from "rxjs";
import { DetailsFormComponent } from "./details-form/details-form.component";

@Component({
  selector: "app-information-request",
  templateUrl: "./information-request.component.html",
  styleUrls: ["./information-request.component.scss"],
  providers: [DatePipe],
})
export class InformationRequestComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  cards: InformationRequestE[] = Array.from({ length: 8 });
  pageSize = 0;
  currentPage = 0;
  totalItems: number;
  loading = false;

  constructor(
    private requestService: InformationRequestService,
    private notification: NotificationsService,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const paginator: PaginationGet = {
      Page: 1,
      Length: 8,
    };
    this.getRequests(paginator);
  }

  formatDate(dateString: string): string {
    const formattedDate = this.datePipe.transform(
      dateString,
      "dd/MM/yyyy hh:mm a"
    );
    return formattedDate || "";
  }

  truncate(value: string, maxLength: number = 100): string {
    if (!value) return "";

    if (value.length <= maxLength) {
      return value.replace(/\n/g, " ");
    } else {
      return value.replace(/\n/g, " ").substr(0, maxLength) + "...";
    }
  }

  onPageChange(event: PageEvent): void {
    const paginator: PaginationGet = {
      Page: event.pageIndex + 1,
      Length: event.pageSize,
    };
    this.getRequests(paginator);
  }

  getRequests(paginator: PaginationGet): void {
    this.loading = true;
    this.cards = Array.from({ length: 4 });
    const searchParams: InformationRequestSearchE = {
      Pagination: paginator,
    };

    this.requestService.getRequestHeader(searchParams).subscribe(
      (response) => {
        this.loading = false;
        this.cards = response.body?.data ?? ([] as InformationRequestE[]);
        this.totalItems = response.body?.totalItemsFiltered ?? 0;
        const remainingEmptyCards = 4 - (this.cards.length % 4);
        if (remainingEmptyCards > 0 && remainingEmptyCards < 4) {
          for (let i = 0; i < remainingEmptyCards; i++) {
            this.cards.push({}); // Puedes ajustar este objeto vacío según la estructura de tu clase
          }
        }
      },
      (error) => {
        this.loading = false;
        var errorMessage = error.error.message ?? error.error.ErrorDetails;
        this.notification.showNotification("danger", errorMessage);
      }
    );
  }

  refreshCardsTable(): void {
    const paginator: PaginationGet = {
      Page: 1,
      Length: 8,
    };
    this.getRequests(paginator);
  }

  NewRequestForm(): void {
    const dialogRef = this.dialog.open(RequestFormComponent, {
      width: "70%",
    });

    dialogRef.afterClosed().subscribe(() => {
      const paginator: PaginationGet = {
        Page: 1,
        Length: 8,
      };
      this.getRequests(paginator);
    });
  }

  closeRequest(card: InformationRequestE): void {
    this.loading = true;
    const message = "¿Seguro desea cerrar la solicitud?";
    this.notification
      .openConfirmDialog(message)
      .pipe(
        switchMap((confirmed: boolean) => {
          if (!confirmed) return of(null);

          return this.requestService.closeRequestE(card.Id);
        }),
        catchError((error) => {
          this.loading = false;
          var errorMessage = error.error.message ?? error.error.ErrorDetails;
          this.notification.showNotification("danger", errorMessage);
          return of(null);
        })
      )
      .subscribe((success) => {
        this.loading = false;
        if (success !== null) {
          this.refreshCardsTable();
          this.notification.showNotification("success", success.body.result);
        }
      });
  }

  detailsRequestForm(card: InformationRequestE): void {
    const dialogRef = this.dialog.open(DetailsFormComponent, {
      width: "95%",
      data: { request: card },
    });

    dialogRef.afterClosed().subscribe(() => {
      const paginator: PaginationGet = {
        Page: 1,
        Length: 8,
      };
      this.getRequests(paginator);
    });
  }
}
