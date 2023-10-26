export interface IValidateDataUseCase {
  validateArroba(arroba: string, myId?: string): Promise<boolean>;
  validatePhone(arroba: string, myId: string): Promise<any>;
  validateEmail(arroba: string, myId: string): Promise<any>;
}
