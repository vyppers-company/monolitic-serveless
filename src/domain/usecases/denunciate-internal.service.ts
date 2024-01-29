import { HttpException, Injectable } from '@nestjs/common';
import { DenunciateRepository } from 'src/data/mongoose/repositories/denunciate.repository';
import {
  IDenunciateQueryDto,
  IVerifyDenuncianteTicketDto,
} from '../interfaces/usecases/denunciate-internal.interface';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { SendSmsAdapter } from 'src/infra/adapters/aws/sns/blow-io.adapter';
import { SESAdapter } from 'src/infra/adapters/aws/ses/ses.adapter';
import { IProfile } from '../entity/user.entity';
import { templatesEmail } from 'src/shared/templates/emailTemplates';
import { templatesSMS } from 'src/shared/templates/smsTemplates';
import { IContentEntity } from '../entity/contents';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { CryptoAdapter } from 'src/infra/adapters/crypto/cryptoAdapter';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';

@Injectable()
export class DenunciateInternalService {
  constructor(
    private readonly denunciateRepository: DenunciateRepository,
    private userRepository: UserRepository,
    private readonly sendSmsAdapter: SendSmsAdapter,
    private readonly sesAdapter: SESAdapter,
    private readonly contentRepository: ContentRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}
  async getTicketsToAnalise(filters: IDenunciateQueryDto) {
    const filter = {};

    if (filters.status) {
      filter['status'] = filters.status;
    }
    if (filters.vypperId) {
      filter['vypperId'] = filters.vypperId;
    }
    if (filters.startDate) {
      filter['startDate'] = filters.startDate;
    }
    if (filters.endDate) {
      filter['endDate'] = filters.endDate;
    }
    if (filters.reason) {
      filter['reason'] = filters.reason;
    }
    if (filters.document) {
      filter['document'] = filters.document;
    }
    const tickets = await this.denunciateRepository.findPaginated(
      {
        limit: Number(filters.limit) || 10,
        page: Number(filters.page) || 1,
        populate: [
          {
            path: 'complainant',
            model: 'User',
            select: 'vypperId name profileImage verified cpf type email phone',
          },
          {
            path: 'reported',
            model: 'User',
            select: 'vypperId name profileImage verified cpf type email phone',
          },
          {
            path: 'contentId',
            model: 'Content',
          },
        ],
      },
      filter,
    );
    return tickets;
  }
  async getTicketById(ticketId: string) {
    return await this.denunciateRepository.findOne(
      { _id: ticketId },
      null,
      {
        lean: true,
        populate: [
          {
            path: 'complainant',
            model: 'User',
            select: 'vypperId name profileImage verified cpf type email phone',
          },
          {
            path: 'reported',
            model: 'User',
            select: 'vypperId name profileImage verified cpf type email phone',
          },
          {
            path: 'contentId',
            model: 'Content',
          },
        ],
      },
      true,
    );
  }
  async verifyTicket(dto: IVerifyDenuncianteTicketDto) {
    const ticket = await this.denunciateRepository.findOne(
      {
        _id: dto.ticketId,
      },
      null,
      {
        populate: [
          { model: 'User', path: 'reported', select: 'email phone name' },
          { model: 'Content', path: 'contentId', select: 'text contents' },
        ],
      },
      true,
    );

    const { email, phone, name } = ticket.reported as IProfile;
    const {
      text,
      contents,
      _id: contentId,
    } = ticket.contentId as IContentEntity;

    if (!ticket) {
      throw new HttpException('ticket doesnt exists', 404);
    }
    if (dto.decisionToBanUser) {
      await this.userRepository.banFromPlataform(
        ticket.reported,
        dto.reviewerId,
        dto.ticketId,
      );
    }
    if (dto.excludeContent) {
      await this.contentRepository.deleteById(contentId);
    }
    await this.denunciateRepository.updateStatus(dto, dto.ticketId);

    if (!email && !phone) {
      return;
    }
    if (email) {
      const decryptedEmail = this.cryptoAdapter.decryptText(
        email,
        ICryptoType.USER,
      );
      await this.sesAdapter.sendEmail(
        decryptedEmail,
        templatesEmail.BAN_USER_MESSAGE.TITLE,
        templatesEmail.BAN_USER_MESSAGE.BODY(
          name,
          text,
          contents.find((image) => image.content).content,
        ),
      );
      return;
    }
    if (phone) {
      const decryptedEPhone = this.cryptoAdapter.decryptText(
        phone,
        ICryptoType.USER,
      );
      await this.sendSmsAdapter.sendSms(
        decryptedEPhone,
        templatesSMS.BAN_USER_MESSAGE.BODY(
          name,
          text,
          contents.find((image) => image.content).content,
        ),
      );
      return;
    }
  }
}
