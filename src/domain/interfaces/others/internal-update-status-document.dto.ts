import {
  IConfirmationData,
  IVerificationStatusEnum,
} from 'src/domain/entity/verify-documents';

export interface IInternalUpdateStatusDocumentDto {
  cardId: string;
  userId: string;
  reason?: string;
  newStatus: IVerificationStatusEnum;
  documentConfirmation: IConfirmationData;
}
