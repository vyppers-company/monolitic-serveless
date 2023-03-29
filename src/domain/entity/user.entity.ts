import { Role } from '../interfaces/others/role.interface';

export interface IUserEntity {
  _id?: string;
  name: string;
  password: string;
  phone: string;
  email: string;
  role: Role;
}
