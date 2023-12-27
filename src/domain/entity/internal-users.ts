import { IHierarchy } from './hierarchy';
import { IInternalRole } from './internal-role';

export interface IInternalUser {
  _id?: string;
  name: string;
  password: string;
  cpf: string;
  email: string;
  phone?: string;
  profileImage?: string;
  hierarchy?: IHierarchy;
  birthday?: string;
  role?: IInternalRole;
  createdBy?: string;
  udpdatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
