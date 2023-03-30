import { IRecoveryDto } from '../others/recovery.interface';

export interface IRcoveryUseCase {
  send: (to: IRecoveryDto) => void;
}
