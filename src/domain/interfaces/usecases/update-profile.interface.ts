import { ProfileDto } from 'src/presentation/dtos/profile.dto';

export interface IUpdateProfileUseCase {
  updateData(myId: string, profile: ProfileDto): Promise<void>;
  updateEmail(myId: string, email: string): Promise<any>;
  updatePhone(myId: string, phone: string): Promise<any>;
}
