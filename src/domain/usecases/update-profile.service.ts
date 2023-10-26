import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IUpdateProfileUseCase } from '../interfaces/usecases/update-profile.interface';
import { ProfileDto } from 'src/presentation/dtos/profile.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ValidateDataService } from './validate-profile-id.service';
import { getAge } from 'src/shared/utils/getAge';

@Injectable()
export class UpdateProfileService implements IUpdateProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly validate: ValidateDataService,
  ) {}
  async updateData(myId: string, dto: ProfileDto): Promise<void> {
    const user = await this.userRepository.findOne({ _id: myId });
    if (dto.vypperID && dto.vypperID !== user.vypperID) {
      const result = await this.validate.validatevypperID(dto.vypperID);
      if (!result) throw new BadRequestException('this vypperID have been used');
    }
    const age = getAge(dto.birthday);

    if (!age) {
      throw new ConflictException('you need to have 18 years old');
    }

    await this.userRepository.updateProfileData(myId, dto);
  }
  updateEmail(myId: string, email: string): Promise<any> {
    return new Promise(null);
  }
  updatePhone(myId: string, phone: string): Promise<any> {
    return new Promise(null);
  }
}
