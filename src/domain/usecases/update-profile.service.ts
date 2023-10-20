import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IUpdateProfileUseCase } from '../interfaces/usecases/update-profile.interface';
import { ProfileDto } from 'src/presentation/dtos/profile.dto';
import { Injectable } from '@nestjs/common';
import { SendSmsAdapter } from 'src/infra/adapters/blow-io.adapter';

@Injectable()
export class UpdateProfileService implements IUpdateProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sendSms: SendSmsAdapter,
  ) {}
  async updateData(myId: string, dto: ProfileDto): Promise<void> {
    await this.userRepository.updateProfileData(myId, dto);
  }
}
