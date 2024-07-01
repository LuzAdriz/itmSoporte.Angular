import { AttachFile } from "./attach-file";

export interface InformationRequestE {
  Id?: number | null;
  CreatedAt?: string | null;
  CreatedBy?: string | null;
  NameUser?: string | null;
  Type?: string | null;
  DepartmentId?: number;
  DepartmentDescription?: string | null;
  DepartmentEmail?: string | null;
  Description?: string | null;
  AttachPath?: string | null;
  Status?: string | null;
  StatusDescription?: string | null;
  AttachFile?: AttachFile | null;
}

export interface InformationRequestD {
  Id?: number | null;
  IdRequest?: number | null;
  CreatedAt?: Date | null;
  CreateBy?: string | null;
  Description?: string | null;
  AttachPath?: string | null;
  UserLog?: number | null;
  DateLog?: Date | null;
  AttachFile?: AttachFile | null;
}
