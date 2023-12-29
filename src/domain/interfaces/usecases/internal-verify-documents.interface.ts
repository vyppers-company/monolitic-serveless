import { IVerificationStatusEnum } from 'src/domain/entity/verify-documents';
import { IInternalUpdateStatusDocumentDto } from '../others/internal-update-status-document.dto';

export interface IVerifyDocumentsInternalService {
  updateStatus: (
    verifierId: string,
    dto: IInternalUpdateStatusDocumentDto,
  ) => Promise<void>;
  getTicketsToVerify: (
    status: IVerificationStatusEnum,
    cardId: string,
  ) => Promise<any>;
}
