import {
  CreateChannelCommand,
  CreateChannelCommandInput,
  CreateRecordingConfigurationCommand,
  Ivs,
} from '@aws-sdk/client-ivs';
import {
  CreateParticipantTokenCommand,
  CreateStageCommand,
  CreateStageCommandInput,
  IVSRealTime,
} from '@aws-sdk/client-ivs-realtime';
import { Inject, Injectable } from '@nestjs/common';
import {
  ICreateLiveChannelResponseAdapter,
  ICreateLiveChannelResponseRealTimeAdapter,
  ICreateLivechannelInputAdapter,
  IIVSAdapter,
} from 'src/domain/interfaces/adapters/ivs.adapter';
import { IInviteUserLiveStreamServiceDto } from 'src/domain/interfaces/usecases/create-room.interface';

import { environment } from 'src/main/config/environment/environment';

@Injectable()
export class IVSAdapter implements IIVSAdapter {
  constructor(
    @Inject('ivs') private readonly ivsAdapter: Ivs,
    @Inject('ivs-realtime') private readonly isvRealtimeAdapter: IVSRealTime,
  ) {}
  async createLiveChannel(
    dto: ICreateLivechannelInputAdapter,
  ): Promise<ICreateLiveChannelResponseAdapter> {
    const config: CreateChannelCommandInput = {
      latencyMode: 'NORMAL',
      type: 'STANDARD',
      name: dto.creatorId,
      authorized: dto.isPrivate,
      insecureIngest: true,
    };

    const recordSettings = dto.keepRecord
      ? await this.ivsAdapter.send(
          new CreateRecordingConfigurationCommand({
            destinationConfiguration: {
              s3: {
                bucketName: environment.aws.s3.hostBucket,
              },
            },
            name: dto.creatorId,
          }),
        )
      : null;

    if (recordSettings) {
      config['recordingConfigurationArn'] =
        recordSettings.recordingConfiguration.arn;
    }

    const channel = await this.ivsAdapter.send(
      new CreateChannelCommand(config),
    );

    return {
      channel: channel.channel.playbackUrl,
      streamKey: channel.streamKey.value,
    };
  }
  async createLiveChannelRealTime(
    input: ICreateLivechannelInputAdapter,
  ): Promise<ICreateLiveChannelResponseRealTimeAdapter> {
    const config: CreateStageCommandInput = {
      name: input.title,
      participantTokenConfigurations: [
        {
          userId: input.creatorId,
          capabilities: ['PUBLISH', 'SUBSCRIBE'],
          attributes: {
            userName: input.vypperId,
          },
        },
      ],
    };
    const recordSettings = input.keepRecord
      ? await this.ivsAdapter.send(
          new CreateRecordingConfigurationCommand({
            destinationConfiguration: {
              s3: {
                bucketName: environment.aws.s3.hostBucket,
              },
            },
            name: input.creatorId,
          }),
        )
      : null;

    if (recordSettings) {
      config['recordingConfigurationArn'] =
        recordSettings.recordingConfiguration.arn;
    }
    const channel = await this.isvRealtimeAdapter.send(
      new CreateStageCommand(config),
    );
    return {
      stage: {
        activationSessionId: channel.stage.activeSessionId,
        arn: channel.stage.arn,
        name: channel.stage.name,
      },
      participantsTokens: channel.participantTokens,
    };
  }
  async createInvites(dto: IInviteUserLiveStreamServiceDto) {
    const tokens = await Promise.all(
      dto.invites.map(
        async (user) =>
          await this.isvRealtimeAdapter.send(
            new CreateParticipantTokenCommand({
              stageArn: dto.salaArn,
              attributes: {
                userName: user.userName || user.userId,
              },
              capabilities: user.permissions,
              userId: user.userId,
            }),
          ),
      ),
    );
    return tokens;
  }
}
