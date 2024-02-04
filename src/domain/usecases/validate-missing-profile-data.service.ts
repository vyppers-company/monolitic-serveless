import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IValidateCompleteProfile } from '../interfaces/usecases/validate-complete-profile.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateMissingDataProfileService
  implements IValidateCompleteProfile
{
  constructor(private readonly userRepository: UserRepository) {}
  async validateMissingDatas(userId: string): Promise<string[]> {
    const result = await this.userRepository.findOne(
      { _id: userId, isBanned: false },
      null,
      {
        lean: true,
      },
    );
    const user = { ...result };
    const missingDatas = [];
    const caracteristicsFields = [
      'hair',
      'eyes',
      'ethnicity',
      'biotype',
      'gender',
    ];
    const interestsFields = ['gender'];

    if (!user.caracteristics || !Object.keys(user.caracteristics).length) {
      missingDatas.push('caracteristics');
      user.caracteristics = {};
    }

    caracteristicsFields.forEach((field) => {
      if (!user.caracteristics.hasOwnProperty(field)) {
        missingDatas.push(`caracteristics.${field}`);
      }
    });

    if (!user.interests || !Object.keys(user.interests).length) {
      missingDatas.push('interests');
      user.interests = {};
    }
    interestsFields.forEach((field) => {
      if (!user.interests.hasOwnProperty(field)) {
        missingDatas.push(`interests.${field}`);
      }
    });

    if (!user.name) missingDatas.push('name');
    if (!user.email) missingDatas.push('email');
    if (!user.phone) missingDatas.push('phone');
    if (!user.birthday) missingDatas.push('birthdate');
    if (!user.verified) missingDatas.push('verified');
    if (!user.profileImage) missingDatas.push('profileImage');
    if (!user.bio) missingDatas.push('bio');
    if (!user.paymentConfiguration) missingDatas.push('paymentConfiguration');
    if (!user.planConfiguration.length) missingDatas.push('planConfiguration');

    return missingDatas;
  }
}
