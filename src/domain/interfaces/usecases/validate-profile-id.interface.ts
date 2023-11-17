export interface IValidateDataUseCase {
  validatevypperId(vypperId: string, myId?: string): Promise<boolean>;
  validatePhone(vypperId: string, myId: string): Promise<any>;
  validateEmail(vypperId: string, myId: string): Promise<any>;
}
