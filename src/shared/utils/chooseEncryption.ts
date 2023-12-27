import { HttpException, HttpStatus } from '@nestjs/common';
import { ICryptoType } from 'src/domain/interfaces/adapters/crypto.interface';

export const chooseEncryptionCode = (type: ICryptoType, object: any) => {
  switch (type) {
    case ICryptoType.INTERNAL_USER:
      return object.keyPassInternalUser;
    case ICryptoType.CODE:
      return object.keyPassCode;
    case ICryptoType.USER:
      return object.keyPassUser;
    default:
      throw new HttpException('unauthorized action', HttpStatus.UNAUTHORIZED);
  }
};
