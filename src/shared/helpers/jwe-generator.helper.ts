import { scryptSync } from 'crypto';
import { environment } from '../../main/config/environment/environment';
import { EncryptJWT, jwtDecrypt } from 'jose';
import { UnauthorizedException } from '@nestjs/common';
import { ICryptoType } from 'src/domain/interfaces/adapters/crypto.interface';
import { IValidationCodeType } from 'src/domain/entity/code.entity';
export const generateToken = async (
  payload: {
    _id: string;
    vypperId?: string;
    email?: string;
    type?: IValidationCodeType;
  },
  type: ICryptoType,
  expires?: number | string,
) => {
  const {
    keyLength,
    keyPassCode,
    keyPassUser,
    keySalt,
    jwe: { algorithm, expiresIn, encrypt },
  } = environment.cryptoData;

  const expiracao = new Date();
  expiracao.setDate(expiracao.getDate() + expiresIn);

  const keyPass = type === ICryptoType.CODE ? keyPassCode : keyPassUser;
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
