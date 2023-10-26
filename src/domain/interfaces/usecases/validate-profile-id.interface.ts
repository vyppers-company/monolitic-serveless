export interface IValidateDataUseCase {
  validatevypperID(vypperID: string, myId?: string): Promise<boolean>;
  validatePhone(vypperID: string, myId: string): Promise<any>;
  validateEmail(vypperID: string, myId: string): Promise<any>;
}
