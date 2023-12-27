import { scryptSync } from 'crypto';
import { environment } from '../../main/config/environment/environment';
import { EncryptJWT, jwtDecrypt } from 'jose';
import { UnauthorizedException } from '@nestjs/common';
import { ICryptoType } from 'src/domain/interfaces/adapters/crypto.interface';
import { IValidationCodeType } from 'src/domain/entity/code.entity';
import { chooseEncryptionCode } from '../utils/chooseEncryption';
import { IInternalRole } from 'src/domain/entity/internal-role';

export const generateToken = async (
  payload: {
    _id: string;
    vypperId?: string;
    email?: string;
    type?: IValidationCodeType;
    cpf?: string;
    role?: IInternalRole;
  },
  type: ICryptoType,
  expiresInMinutes?: number,
) => {
  const {
    keyLength,
    keySalt,
    jwe: { algorithm, expiresInDays, encrypt },
  } = environment.cryptoData;

  const expiracao = new Date();

  !expiresInMinutes
    ? expiracao.setDate(expiracao.getDate() + expiresInDays)
    : expiracao.setMinutes(expiracao.getMinutes() + expiresInMinutes);

  const keyPass = chooseEncryptionCode(type, environment.cryptoData);
  const key = scryptSync(keyPass, keySalt, keyLength);
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: algorithm, enc: encrypt })
    .setExpirationTime(expiracao.getTime())
    .encrypt(key);
};

export const decryptData = async (
  token: string,
  type: ICryptoType,
): Promise<any> => {
  const { keyLength, keyPassCode, keyPassUser, keySalt } =
    environment.cryptoData;
  const keyPass = type === ICryptoType.CODE ? keyPassCode : keyPassUser;

  const key = scryptSync(keyPass, keySalt, keyLength);
  const decrypted = await jwtDecrypt(token, key);

  if (!decrypted?.payload) {
    throw new UnauthorizedException();
  }

  return decrypted.payload;
};
