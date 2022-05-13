import {Bug} from "./bug";
import {Role} from "./role";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;

  username: string;
  password: string;
  status: number;
  token: string;
  bugsCreated?: Bug[];
  bugsAssigned?: Bug[];
  roles: Role[];
  notifications?: string[];
}
