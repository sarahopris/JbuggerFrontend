import {Role} from "./role";

export interface UserDTO {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  email?: string;
  username?: string;
  password?: string;
  roles?: Role[];
}
