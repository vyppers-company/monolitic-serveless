export type IVerificationStatus = 'WAITING' | 'APPROVED' | 'FAILED';

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
  status: IVerificationStatus;
  documentConfirmation?: IConfirmationData;
  verifiedBy?: string;
  reason?: string;
}
