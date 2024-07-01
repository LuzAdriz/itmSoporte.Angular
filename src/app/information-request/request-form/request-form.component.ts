import {
  Component,
  ElementRef,
  OnInit,
  Optional,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Departament } from "app/interfaces/departament";
import { InformationRequestE } from "app/interfaces/information-request";
import { NotificationsService } from "app/services/generics/notifications.service";
import { DepartamentService } from "app/services/information-request/departament.service";
import { InformationRequestService } from "app/services/information-request/information-request.service";

@Component({
  selector: "app-information-request-form",
  templateUrl: "./request-form.component.html",
  styleUrls: ["./request-form.component.scss"],
})
export class RequestFormComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef | undefined;

  departaments: Departament[] = [];
  requestForm: FormGroup;
  loading = false;
  attachFileName: string;
  archivoSeleccionadoTipo: string;

  constructor(
    @Optional() public dialogRef: MatDialogRef<RequestFormComponent>,
    private formBuilder: FormBuilder,
    private notification: NotificationsService,
    private requestService: InformationRequestService,
    private deparatamentService: DepartamentService
  ) {
    this.requestForm = this.formBuilder.group({
      Id: [],
      CreatedAt: [],
      CreatedBy: [],
      Type: ["", Validators.required],
      DepartmentId: [null, Validators.required],
      Description: ["", Validators.required],
      AttachPath: [],
      Status: ["A", [Validators.required, Validators.maxLength(1)]],
      AttachFile: [],
    });
  }

  ngOnInit(): void {
    this.findDepartaments();
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  findDepartaments(): void {
    this.deparatamentService.getAll().subscribe(
      (response) => {
        this.departaments = response.body;
        this.notification.showNotification(
          "success",
          "Departamentos cargados exitosamente"
        );
      },
      (error) => {
        var errorMessage = error.error.message;
        this.notification.showNotification("danger", errorMessage);
      }
    );
  }

  insertNewRequest() {
    this.loading = true;
    this.requestForm.disable();
    const request = this.requestForm.value as InformationRequestE;
    const requestValue = { ...request };
    delete requestValue.AttachFile;
    const formData = new FormData();
    formData.append("Attach", this.requestForm.get("AttachFile").value);
    formData.append("JsonModel", JSON.stringify(requestValue));

    this.requestService.inserRequestE(formData).subscribe(
      (response) => {
        this.loading = false;
        this.requestForm.enable();
        this.requestForm.reset();
        const result = response.body.result;
        this.notification.showNotification("success", result);
        this.closeForm();
      },
      (error) => {
        this.loading = false;
        this.requestForm.enable();
        var errorMessage = error.error.message ?? error.error.ErrorDetails;
        this.notification.showNotification("danger", errorMessage);
      }
    );
  }

  openFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(files: FileList): void {
    const file = files.item(0);
    if (file) {
      this.attachFileName = file.name;
      this.requestForm.get("AttachFile").setValue(file);
    }
  }

  removeFile(): void {
    this.attachFileName = "";
    this.requestForm.get("AttachFile").setValue(null);
  }
}
