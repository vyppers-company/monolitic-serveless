import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DenunciateRepository } from 'src/data/mongoose/repositories/denunciate.repository';
import {
  IDenunciateQueryDto,
  IVerifyDenuncianteTicketDto,
} from '../interfaces/usecases/denunciate-internal.interface';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { SESAdapter } from 'src/infra/adapters/aws/ses/ses.adapter';
import { IProfile } from '../entity/user.entity';
import { templatesEmail } from 'src/shared/templates/emailTemplates';
import { templatesSMS } from 'src/shared/templates/smsTemplates';
import { IContentEntity } from '../entity/contents';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { CryptoAdapter } from 'src/infra/adapters/crypto/cryptoAdapter';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';
import { IStatusDenunciate } from '../entity/denunciate';
import { SNSAdapter } from 'src/infra/adapters/aws/sns/aws-sns.adapter';

@Injectable()
export class DenunciateInternalService {
  constructor(
    private readonly denunciateRepository: DenunciateRepository,
    private userRepository: UserRepository,
    private readonly snsAdapter: SNSAdapter,
    private readonly sesAdapter: SESAdapter,
    private readonly contentRepository: ContentRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}
  async getTicketsToAnalise(filters: IDenunciateQueryDto) {
    const filterByUser = [];
    const filterByContent = [];
    const filterByComplaint = [];

    if (filters.status) {
      filterByComplaint.push({
        status: filters.status,
      });
    }

    if (filters.vypperId) {
      filterByUser.push({
        vypperId: { $regex: filters.vypperId, $options: 'i' },
      });
    }
    if (filters.startDate && filters.endDate) {
      filterByContent.push({
        createdAt: {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate),
        },
      });
    } else {
      // Se apenas startDate OU endDate for fornecido, aplica os filtros individualmente
      if (filters.startDate) {
        filterByContent.push({
          createdAt: { $gte: new Date(filters.startDate) },
        });
      }
      if (filters.endDate) {
        filterByContent.push({
          createdAt: { $lte: new Date(filters.endDate) },
        });
      }
    }
    if (filters.reason) {
      filterByComplaint.push({
        reason: filters.reason,
      });
    }
    if (filters.document) {
      filterByUser.push({
        cpf: { $regex: filters.document, $options: 'i' },
      });
    }

    const finalComplainantFilter = {};
    if (filterByComplaint.length) {
      finalComplainantFilter['$and'] = filterByComplaint;
    }
    const finalUserFilter = {};
    if (filterByUser.length) {
      finalUserFilter['$and'] = filterByUser;
    }
    const finalContentFilter = {};
    if (filterByContent.length) {
      finalContentFilter['$and'] = filterByContent;
    }
    const result = await this.denunciateRepository.findPaginated(
      {
        limit: Number(filters.limit) || 10,
        page: Number(filters.page) || 1,
        populate: [
          {
            path: 'complainant',
            model: 'User',
          },
          {
            path: 'reported',
            model: 'User',
            match: finalUserFilter,
          },
          {
            path: 'contentId',
            model: 'Content',
            match: finalContentFilter,
          },
        ],
      },
      finalComplainantFilter,
    );

    return {
      totalDocs: result.totalDocs,
      limit: result.limit,
      totalPages: result.totalPages,
      page: result.page,
      offset: result.offset,
      pagingCounter: result.pagingCounter,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      docs: result.docs.map((doc) => ({
        ...doc,
        complainant: doc.complainant || 'Not Found, deleted by user',
        reported: doc.reported || 'Not Found, deleted by user',
        contentId: doc.contentId || 'Not Found, deleted by user',
      })),
    };
  }

  async getTicketById(ticketId: string) {
    const result = await this.denunciateRepository.findOne(
      { _id: ticketId },
      null,
      {
        lean: true,
        populate: [
          {
            path: 'complainant',
            model: 'User',
          },
          {
            path: 'reported',
            model: 'User',
          },
          {
            path: 'contentId',
            model: 'Content',
          },
        ],
      },
    );
    return {
      ...result,
      complainant: result.complainant || 'Not Found, deleted by user',
      reported: result.reported || 'Not Found, deleted by user',
      contentId: result.contentId || 'Not Found, deleted by user',
    };
  }
  async verifyTicket(dto: IVerifyDenuncianteTicketDto) {
    const ticket = await this.denunciateRepository.findOne(
      {
        _id: dto.ticketId,
        status: IStatusDenunciate.OPENED,
      },
      null,
      {
        populate: [
          {
            model: 'User',
            path: 'reported',
          },
          { model: 'Content', path: 'contentId' },
        ],
      },
    );

    if (!ticket) {
      throw new HttpException('ticket not found', HttpStatus.NOT_FOUND);
    }

    const { email, phone, name } = ticket.reported as IProfile;
    const {
      text,
      contents,
      _id: contentId,
    } = ticket.contentId as IContentEntity;

    if (dto.decisionToBanUser) {
      await this.userRepository.banFromPlataform(ticket.reported);
      await this.contentRepository.deleteSoftMany(ticket.reported);
    }
    if (dto.excludeContent) {
      await this.contentRepository.deleteSoftOne(contentId);
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
      await this.snsAdapter.sendSms(
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
