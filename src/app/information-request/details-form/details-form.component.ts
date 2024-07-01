import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Optional,
  ViewChild,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { InformationRequestService } from "app/services/information-request/information-request.service";
import {
  InformationRequestE,
  InformationRequestD,
} from "app/interfaces/information-request";
import { NotificationsService } from "app/services/generics/notifications.service";
import { catchError, of, switchMap } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AttachFile } from "app/interfaces/attach-file";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-details-form",
  templateUrl: "./details-form.component.html",
  styleUrls: ["./details-form.component.scss"],
  providers: [DatePipe],
})
export class DetailsFormComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef | undefined;

  request: InformationRequestE;
  details: InformationRequestD;
  showNewResponseForm = false;
  detailsForm: FormGroup;
  loading = false;
  attachFileName: string;
  archivoSeleccionadoTipo: string;
  showNewDetails = false;
  isCloseRequest = false;

  constructor(
    @Optional() public dialogRef: MatDialogRef<DetailsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public matData: any,
    private requestService: InformationRequestService,
    private notification: NotificationsService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    const requestE = this.matData.request as InformationRequestE;
    this.detailsForm = this.formBuilder.group({
      Id: [],
      IdRequest: [requestE.Id],
      CreatedAt: [],
      CreatedBy: [],
      Description: ["", Validators.required],
      AttachPath: [],
      AttachFile: [],
    });
  }

  ngOnInit(): void {
    const requestE = this.matData.request as InformationRequestE;
    this.setData(requestE.Id);
  }

  formatDate(dateString: string): string {
    const formattedDate = this.datePipe.transform(
      dateString,
      "dd/MM/yyyy hh:mm a"
    );
    return formattedDate || "";
  }

  setData(requestId: number): void {
    this.requestService
      .findRequestById(requestId)
      .pipe(
        switchMap((success) => {
          this.request = success.body;
          this.isCloseRequest = this.request.Status === "C";
          if (!this.request) {
            const noDataMgs = `No existen datos para la solicitud # ${requestId}`;
            this.notification.showNotification("danger", noDataMgs);
            return of(null);
          }
          return this.requestService.findDetailsByRequestId(requestId);
        }),
        catchError((error) => {
          var errorMessage = error.error.message ?? error.error.ErrorDetails;
          this.notification.showNotification("danger", errorMessage);
          return of(null);
        })
      )
      .subscribe((success) => {
        if (success) this.details = success.body;
        else this.closeForm();

        console.log("data details", this.details);
      });
  }

  toggleNewResponseForm() {
    this.showNewResponseForm = !this.showNewResponseForm;
  }

  openFileInput(): void {
    if (this.fileInput) this.fileInput.nativeElement.click();
  }

  onFileSelected(files: FileList): void {
    const file = files.item(0);
    if (file) {
      this.attachFileName = file.name;
      this.detailsForm.get("AttachFile").setValue(file);
    }
  }

  removeFile(): void {
    this.attachFileName = "";
    this.detailsForm.get("AttachFile").setValue(null);
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  insertNewDetail() {
    this.showNewDetails = true;
    this.loading = true;
    this.detailsForm.disable();
    const details = this.detailsForm.value as InformationRequestD;
    const detailsValue = { ...details };
    delete detailsValue.AttachFile;
    const formData = new FormData();
    formData.append("Attach", this.detailsForm.get("AttachFile").value);
    formData.append("JsonModel", JSON.stringify(detailsValue));

    this.requestService.inserRequestD(formData).subscribe(
      (response) => {
        this.loading = false;
        this.detailsForm.enable();
        this.detailsForm.reset();
        this.detailsForm.get("IdRequest").setValue(this.matData.request.Id);
        const result = response.body.result;
        this.notification.showNotification("success", result);
        this.setData(details.IdRequest);
        this.removeFile();
        this.showNewDetails = false;
      },
      (error) => {
        this.loading = false;
        this.detailsForm.enable();
        var errorMessage = error.error.message ?? error.error.ErrorDetails;
        this.notification.showNotification("danger", errorMessage);
      }
    );
  }

  downloadFile(attachFile: AttachFile) {
    const byteCharacters = atob(attachFile.Base64File);
    const byteArrays = [new Uint8Array(byteCharacters.length)];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[0][i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob(byteArrays, { type: attachFile.ContentType });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = attachFile.Name;
    link.click();
  }

  resetForm(): void {
    this.detailsForm.reset();
    this.detailsForm.updateValueAndValidity();
    this.removeFile();
    this.detailsForm.get("IdRequest").setValue(this.matData.request.Id);
  }
}
