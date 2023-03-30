import { IChangePasswordDto } from '../others/change-password.interface';

export interface IChangePasswordService {
  change: (dto: IChangePasswordDto) => void;
}
