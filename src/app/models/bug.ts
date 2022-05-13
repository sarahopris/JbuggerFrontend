import {Status} from "../enums/status";
import {Severity} from "../enums/severity";
import {Attachment} from "./attachment";

export interface Bug {
  idBug: number;
  title: string;
  description: string;
  version: string;
  targetDate: Date;
  status: Status;
  fixedVersion: string;
  severity: Severity;
  createdByUsername: string;
  assignedToUsername: string;
  attachments: Attachment[];
}
