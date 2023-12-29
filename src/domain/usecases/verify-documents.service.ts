import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { VerifyDocumentsRepository } from 'src/data/mongoose/repositories/verify-documents.repository';
import { IVerifyDocumentsUseCase } from '../interfaces/usecases/verify-documents.interface';
import {
  IDocumentData,
  IVerificationStatusEnum,
} from '../entity/verify-documents';

@Injectable()
export class VerifyDocumentsService implements IVerifyDocumentsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verify: VerifyDocumentsRepository,
  ) {}
  async submit(dto: IDocumentData, userId: string) {
    const user = await this.userRepository.findOne({ _id: userId });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const hasDocumentInAnalize = await this.verify.findOne(
      { owner: userId },
      null,
      { limit: 1, sort: { createdAt: -1 } },
    );

    if (
      hasDocumentInAnalize &&
      hasDocumentInAnalize.status === IVerificationStatusEnum.APPROVED
    ) {
      throw new HttpException(
        'Your document was verified with success and you have already passed',
        HttpStatus.NOT_MODIFIED,
      );
    }

    if (
      hasDocumentInAnalize &&
      hasDocumentInAnalize.status === IVerificationStatusEnum.WAITING
    ) {
      throw new HttpException(
        'document has still under analyzed, await please',
        HttpStatus.CONFLICT,
      );
    }

    const result = await this.verify.create({
      documents: {
        justDocumentOpened: dto.justDocumentOpened,
        personHoldingDocument: dto.personHoldingDocument,
      },
      owner: userId,
      status: IVerificationStatusEnum.WAITING,
      isValid: false,
    });

    return {
      _id: result._id,
      status: result.status,
      documents: {
        justDocumentOpened: dto.justDocumentOpened,
        personHoldingDocument: dto.personHoldingDocument,
      },
      owner: result.owner,
      isValid: result.isValid,
      documentConfirmation: result.documentConfirmation
        ? {
            name: result.documentConfirmation.name,
            number: result.documentConfirmation.number,
            expiresIn: result.documentConfirmation.expiresIn,
            emitterOrganization:
              result.documentConfirmation.emitterOrganization,
          }
        : null,
      reason: result.reason || null,
    };
  }

  async getStatus(myId: string) {
    const user = await this.userRepository.findOne({ _id: myId });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const documentsInAnalise = await this.verify.find({ owner: myId }, null, {
      sort: { createdAt: -1 },
      lean: true,
    });

    if (!documentsInAnalise.length && !user.verified === false) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }

    return documentsInAnalise.map((hasDocumentInAnalize) => ({
      _id: hasDocumentInAnalize._id,
      status: hasDocumentInAnalize.status,
      documents: {
        justDocumentOpened: hasDocumentInAnalize.documents.justDocumentOpened,
        personHoldingDocument:
          hasDocumentInAnalize.documents.personHoldingDocument,
      },
      owner: hasDocumentInAnalize.owner,
      isValid: hasDocumentInAnalize.isValid,
      documentConfirmation: hasDocumentInAnalize.documentConfirmation
        ? {
            name: hasDocumentInAnalize.documentConfirmation.name,
            number: hasDocumentInAnalize.documentConfirmation.number,
            expiresIn: hasDocumentInAnalize.documentConfirmation.expiresIn,
            emitterOrganization:
              hasDocumentInAnalize.documentConfirmation.emitterOrganization,
          }
        : null,
      reason: hasDocumentInAnalize.reason || null,
      createdAt: hasDocumentInAnalize.createdAt,
      updatedAt: hasDocumentInAnalize.updatedAt,
    }));
  }
}
