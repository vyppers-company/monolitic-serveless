import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IValidateArroba } from '../interfaces/usecases/validate-profile-id.interface';

@Injectable()
export class ValidateArrobaService implements IValidateArroba {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(arroba: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      arroba: arroba,
    });

    if (user) {
      return false;
    }

    return true;
  }
}
