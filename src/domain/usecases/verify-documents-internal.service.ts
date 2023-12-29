import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { VerifyDocumentsRepository } from 'src/data/mongoose/repositories/verify-documents.repository';
import { IVerificationStatusEnum } from '../entity/verify-documents';
import { groupBySimple } from 'src/shared/utils/groupBy';
import { IInternalUpdateStatusDocumentDto } from '../interfaces/others/internal-update-status-document.dto';
import { IVerifyDocumentsInternalService } from '../interfaces/usecases/internal-verify-documents.interface';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';

@Injectable()
export class VerifyDocumentsInternalService
  implements IVerifyDocumentsInternalService
{
  constructor(
    private readonly verify: VerifyDocumentsRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async updateStatus(
    verifierId: string,
    dto: IInternalUpdateStatusDocumentDto,
  ) {
    if (!dto.reason && dto.newStatus !== IVerificationStatusEnum.APPROVED) {
      throw new HttpException(
        'when status is diferent of APPROVED, the field reason is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      !dto.documentConfirmation &&
      dto.newStatus === IVerificationStatusEnum.APPROVED
    ) {
      throw new HttpException(
        'confirmation data of document is required when status is APPROVED',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userRepository.findOne({ _id: dto.userId }, null, {
      lean: true,
    });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const ticket = await this.verify.findOne(
      {
        _id: dto.cardId,
        owner: user._id,
      },
      null,
      { lean: true },
    );

    if (!ticket) {
      throw new HttpException('card not found', HttpStatus.NOT_FOUND);
    }

    if (ticket.status === dto.newStatus) {
      throw new HttpException('status cant be the same', HttpStatus.CONFLICT);
    }

    if (
      ticket.status === IVerificationStatusEnum.APPROVED &&
      dto.newStatus === IVerificationStatusEnum.WAITING
    ) {
      throw new HttpException(
        'you can revoge an approvement but not returns to WAITING, please if you want revoge a equivocated approvement turns up the ticket to FAILED',
        HttpStatus.CONFLICT,
      );
    }

    if (
      ticket.status === IVerificationStatusEnum.FAILED &&
      dto.newStatus === IVerificationStatusEnum.WAITING
    ) {
      throw new HttpException(
        'you cant move this ticket to WAITING again, the user needs to submit documents again',
        HttpStatus.CONFLICT,
      );
    }

    if (
      ticket.status === IVerificationStatusEnum.FAILED &&
      dto.newStatus === IVerificationStatusEnum.APPROVED
    ) {
      throw new HttpException(
        'you cant move this ticket to APPROVED after to revoge a document, the user needs to submit documents again',
        HttpStatus.CONFLICT,
      );
    }

    const finalDto = {
      ...ticket,
      verifiedBy: verifierId,
      reason: dto.reason || null,
      status: dto.newStatus,
      isValid:
        dto.newStatus === IVerificationStatusEnum.APPROVED ? true : false,
      documentConfirmation: dto.documentConfirmation
        ? {
            name: dto.documentConfirmation.name,
            number: dto.documentConfirmation.number,
            expiresIn: dto.documentConfirmation.expiresIn,
            emitterOrganization: dto.documentConfirmation.emitterOrganization,
          }
        : null,
    };
    await this.verify.setStatus(finalDto);
    await this.userRepository.changeStatusVerified(
      user._id,
      dto.newStatus === IVerificationStatusEnum.APPROVED ? true : false,
    );
  }

  async getTicketsToVerify(status: IVerificationStatusEnum, cardId: string) {
    const filter = {};

    if (!!status) {
      filter['status'] = status;
    }

    if (!!cardId) {
      return await this.verify.findOne({ _id: cardId });
    }

    const cards = await this.verify.findWithRelations(filter, [
      {
        path: 'owner',
        model: 'User',
        select: 'vypperId name profileImage verified cpf type email phone',
      },
    ]);

    if (!status) {
      return groupBySimple(cards, 'status');
    }
    return cards;
  }
}
