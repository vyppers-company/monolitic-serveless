import { Role } from 'src/domain/interfaces/role.interface';

export interface IBffMsRegisterEntity {
  _id?: string;
  name: string;
  password: string;
  phone: string;
  role: Role;
}
