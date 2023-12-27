import { IInternalRole } from 'src/domain/entity/internal-role';

export interface ILogged {
  _id: string;
  email: string;
  vypperId: string;
}

export interface ILoggedInternalUser {
  _id: string;
  email: string;
  cpf: string;
  role: IInternalRole;
}
