import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CodeRepository } from '../../data/mongoose/repositories/code.repository';
import { ICode, ITokenCode } from '../interfaces/others/recovery.interface';
import { generateToken } from 'src/shared/helpers/jwe-generator.helper';
import { IValidateCode } from '../interfaces/usecases/validate-code.interface';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';

@Injectable()
export class ValidateCodeService implements IValidateCode {
  constructor(private readonly codeRecoveryRepository: CodeRepository) {}
  async validateCode(dto: ICode): Promise<ITokenCode> {
    const code = await this.codeRecoveryRepository.findOne({
      code: dto.code,
    });

    if (!code) {
      throw new UnprocessableEntityException();
    }

    const tokenCode = await generateToken(
      { _id: code._id },
      ICryptoType.CODE,
      0.0014,
    );
    return { tokenCode };
  }
}
