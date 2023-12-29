export type IVerificationStatus = 'WAITING' | 'APPROVED' | 'FAILED';

export enum IVerificationStatusEnum {
  WAITING = 'WAITING',
  APPROVED = 'APPROVED',
  FAILED = 'FAILED',
}
export interface IConfirmationData {
  name: string;
  number: string;
  expiresIn: string;
  emitterOrganization: string;
}

export interface IDocumentData {
  justDocumentOpened: string;
  personHoldingDocument: string;
}

export interface IVerifyDocuments {
  _id?: string;

  owner: string;
  documents: IDocumentData;
  isValid: boolean;
  status: IVerificationStatusEnum;
  documentConfirmation?: IConfirmationData;
  verifiedBy?: string;
  reason?: string;

  createdAt?: string;
  updatedAt?: string;
}
