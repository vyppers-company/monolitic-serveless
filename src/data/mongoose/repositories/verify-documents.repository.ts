import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICodeEntity } from '../../../domain/entity/code.entity';

import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import {
  VerifyDocuments,
  VerifyDocumentsDocument,
} from '../model/verify-documents.schema';
import { IVerificationStatus } from 'src/domain/entity/verify-documents';

@Injectable()
export class VerifyDocumentsRepository extends BaseAbstractRepository<VerifyDocumentsDocument> {
  constructor(
    @InjectModel(VerifyDocuments.name)
    private readonly verifyDocuments: BaseModel<VerifyDocumentsDocument>,
  ) {
    super(verifyDocuments);
  }

  async setStatus(
    ownerId: ICodeEntity,
    verifiedBy: string,
    status: IVerificationStatus,
    documentConfirmationNumber: string | null,
    reason: string | null,
  ) {
    return this.verifyDocuments.updateOne(
      { owner: ownerId },
      {
        $set: {
          status,
          verifiedBy,
          documentConfirmationNumber,
          reason,
        },
      },
      { lean: true, returnDocument: 'after' },
    );
  }
}
