import { Role } from '../interfaces/others/role.interface';

export interface IBffMsRegisterEntity {
  _id?: string;
  name: string;
  password: string;
  phone: string;
  role: Role;
}
