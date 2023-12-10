import {
  IDocumentData,
  IVerifyDocuments,
} from 'src/domain/entity/verify-documents';

export interface IVerifyDocumentsUseCase {
  submit: (dto: IDocumentData, userId: string) => Promise<IVerifyDocuments>;
  getStatus: (myId: string) => Promise<IVerifyDocuments>;
}
