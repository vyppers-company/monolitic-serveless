import { ParticipantToken } from '@aws-sdk/client-ivs-realtime';
import { IInviteUserLiveStreamServiceDto } from '../usecases/create-room.interface';

export interface ICreateLiveChannelResponseAdapter {
  channel: string;
  streamKey: string;
}
export interface IRoomRealTime {
  arn: string;
  activationSessionId: string;
  name: string;
}
export type IParticipantsTokens = ParticipantToken[];
export interface ICreateLiveChannelResponseRealTimeAdapter {
  stage: IRoomRealTime;
  participantsTokens: IParticipantsTokens;
}
export interface ICreateLivechannelInputAdapter {
  keepRecord: boolean;
  isPrivate: boolean;
  title: string;
  creatorId?: string;
  vypperId?: string;
  authorizedUsers?: string[];
}

export interface IIVSAdapter {
  createLiveChannel: (
    input: ICreateLivechannelInputAdapter,
  ) => Promise<ICreateLiveChannelResponseAdapter>;
  createLiveChannelRealTime: (
    input: ICreateLivechannelInputAdapter,
  ) => Promise<ICreateLiveChannelResponseRealTimeAdapter>;
  createInvites: (dto: IInviteUserLiveStreamServiceDto) => Promise<any>;
}
