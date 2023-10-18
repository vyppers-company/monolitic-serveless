import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IUpdateProfileUseCase } from '../interfaces/usecases/update-profile.interface';
import { ProfileDto } from 'src/presentation/dtos/profile.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateProfileService implements IUpdateProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async updateData(myId: string, data: ProfileDto): Promise<void> {
    await this.userRepository.updateProfileData(myId, data);
  }
}
