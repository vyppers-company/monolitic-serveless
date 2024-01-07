import { ParticipantToken } from '@aws-sdk/client-ivs-realtime';

export interface ICreateLiveChannelResponse {
  channel: string;
  streamKey: string;
}
export interface ICreateLivechannelInput {
  keepRecord: boolean;
  isPrivate: boolean;
  creatorId: string;
  title: string;
  plansId?: string[];
}
export interface IRoomRealTime {
  arn: string;
  activationSessionId: string;
  name: string;
}
export type IParticipantsTokens = ParticipantToken[];
export interface ICreateLiveChannelResponseRealTime {
  stage: IRoomRealTime;
  participantsTokens: IParticipantsTokens;
}
export type IPermissionsInvite = ['PUBLISH', 'SUBSCRIBE'];
export class IInviteUserDto {
  permissions: IPermissionsInvite;
  userId: string;
  userName?: string;
}
export class IInviteUserLiveStreamDto {
  invites: IInviteUserDto[];
}
export interface IInviteUserLiveStreamServiceDto {
  inviterId: string;
  salaArn: string;
  invites: IInviteUserDto[];
}

export interface ICreateRoomUseCase {
  createLiveChannel: (
    dto: ICreateLivechannelInput,
  ) => Promise<ICreateLiveChannelResponse>;
  createLiveChannelRealTime: (
    input: ICreateLivechannelInput,
  ) => Promise<ICreateLiveChannelResponseRealTime>;
  inviteUserLiveStream: (dto: IInviteUserLiveStreamServiceDto) => Promise<any>;
}
