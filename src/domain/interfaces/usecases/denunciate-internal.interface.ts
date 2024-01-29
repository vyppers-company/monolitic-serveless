import {
  IDenuncianteReasons,
  IDenunciate,
  IStatusDenunciate,
} from 'src/domain/entity/denunciate';

export interface IDenunciateQueryDto {
  limit?: number;
  page?: number;
  status?: IStatusDenunciate;
  vypperId?: string;
  document?: string;
  reason?: IDenuncianteReasons;
  startDate?: Date;
  endDate?: Date;
}

export interface IVerifyDenuncianteTicketDto {
  reviewerId?: string;
  ticketId?: string;
  status?: IStatusDenunciate;
  excludeContent: boolean;
  decisionToBanUser: boolean;
  decisionReason: string;
}

export interface IDenuncianteInternalUseCase {
  getTicketsToAnalise: (filters: IDenunciateQueryDto) => Promise<IDenunciate[]>;
  getTicketById: (id: string) => Promise<IDenunciate>;
  verifyTicket: (dto: IVerifyDenuncianteTicketDto) => Promise<void>;
}
