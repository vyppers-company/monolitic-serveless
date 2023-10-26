import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IValidateCompleteProfile } from '../interfaces/usecases/validate-complete-profile.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateMissingDataProfileService
  implements IValidateCompleteProfile
{
  constructor(private readonly userRepository: UserRepository) {}
  async validateMissingDatas(userId: string): Promise<string[]> {
    const user = await this.userRepository.findOne({ _id: userId });
    const missingDatas = [];

    if (!user.name) missingDatas.push('name');
    if (!user.email) missingDatas.push('email');
    if (!user.phone) missingDatas.push('phone');
    if (!user.birthday) missingDatas.push('birthdate');
    if (!user.gender) missingDatas.push('gender');
    if (!user.profileImage) missingDatas.push('profileImage');
    if (!user.bio) missingDatas.push('bio');
    if (!user.interests.length) missingDatas.push('interests');

    return missingDatas;
  }
}
