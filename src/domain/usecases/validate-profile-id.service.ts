import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IValidateProfileId } from '../interfaces/usecases/validate-profile-id.interface';

@Injectable()
export class ValidateProfileIdService implements IValidateProfileId {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(profileId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      profileId: profileId,
    });

    if (user) {
      return false;
    }

    return true;
  }
}
