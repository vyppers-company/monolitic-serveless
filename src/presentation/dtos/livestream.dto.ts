import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import {
  IInviteUserDto,
  IInviteUserLiveStreamDto,
  IPermissionsInvite,
} from 'src/domain/interfaces/usecases/create-room.interface';

export class CreateLiveChannelDto {
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'if the live will be recoreded',
    required: true,
  })
  keepRecord: boolean;
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'if is private live for subscribers',
    required: true,
  })
  isPrivate: boolean;
  @IsArray()
  @ApiProperty({
    example: ['array_of_plans'],
    description: 'plaId if the live is private and for some buyers',
    required: false,
  })
  @IsOptional()
  plansId?: string[];

  @IsString()
  @ApiProperty({
    example: true,
    description: 'live title',
    required: true,
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'nao aceita espaco nem caracteres especiais',
  })
  title: string;
}

export class InviteUserDto implements IInviteUserDto {
  @IsIn(['PUBLISH', 'SUBSCRIBE'], { each: true })
  @ApiProperty({ required: true, examples: ['PUBLISH', 'SUBSCRIBE'] })
  permissions: IPermissionsInvite;
  @IsString()
  @ApiProperty({ required: true })
  userId: string;
}
export class InviteUserLiveStreamDto implements IInviteUserLiveStreamDto {
  @IsArray()
  @ApiProperty({
    required: true,
    example: JSON.stringify([
      {
        permissions: ['PUBLISH', 'SUBSCRIBE'],
        userId: 'userIdaqui',
      },
    ]),
  })
  invites: InviteUserDto[];
  @ApiProperty({ required: true })
  salaArn: string;
}
