import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IUserEntity } from '../entity/user.entity';
import { ILogged } from '../interfaces/others/logged.interface';
import { IUserService } from '../interfaces/usecases/user-service.interface';

export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getPersonalData(
    logged: ILogged,
  ): Promise<Pick<IUserEntity, 'email' | 'phone'>> {
    const user = await this.userRepository.findOne({ _id: logged._id });
    return { email: user.email, phone: user.phone };
  }
}
