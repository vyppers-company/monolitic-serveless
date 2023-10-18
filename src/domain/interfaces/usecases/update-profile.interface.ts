import { ProfileDto } from 'src/presentation/dtos/profile.dto';

export interface IUpdateProfileUseCase {
  updateData(myId: string, profile: ProfileDto): Promise<void>;
}
