import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import {
  VerifyDocuments,
  VerifyDocumentsDocument,
} from '../model/verify-documents.schema';
import { IVerifyDocuments } from 'src/domain/entity/verify-documents';

@Injectable()
export class VerifyDocumentsRepository extends BaseAbstractRepository<VerifyDocumentsDocument> {
  constructor(
    @InjectModel(VerifyDocuments.name)
    private readonly verifyDocuments: BaseModel<VerifyDocumentsDocument>,
  ) {
    super(verifyDocuments);
  }

  async setStatus(dto: IVerifyDocuments) {
    return this.verifyDocuments.updateOne(
      { owner: dto.owner, _id: dto._id },
      {
        $set: {
          ...dto,
        },
      },
      { lean: true, returnDocument: 'after' },
    );
  }
}
