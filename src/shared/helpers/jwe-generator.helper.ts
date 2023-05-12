import { scryptSync } from 'crypto';
import { environment } from '../../main/config/environment';
import { EncryptJWT, jwtDecrypt } from 'jose';
import { UnauthorizedException } from '@nestjs/common';
export const generateToken = async (payload: {
  _id: string;
  role?: string | null;
}) => {
  const {
    keyLength,
    keyPass,
    keySalt,
    jwe: { algorithm, expiresIn, encrypt },
  } = environment.cryptoData;
  const key = scryptSync(keyPass, keySalt, keyLength);
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: algorithm, enc: encrypt })
    .setExpirationTime(expiresIn)
    .encrypt(key);
};

export const decryptData = async (token: string): Promise<any> => {
  const { keyLength, keyPass, keySalt } = environment.cryptoData;

  const key = scryptSync(keyPass, keySalt, keyLength);
  const decrypted = await jwtDecrypt(token, key);

  if (!decrypted?.payload) {
    throw new UnauthorizedException();
  }

  return decrypted.payload;
};
