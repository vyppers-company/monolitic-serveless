import { scryptSync } from 'crypto';
import { environment } from 'src/main/config/environment';
import { EncryptJWT } from 'jose';
export const generateToken = async (payload: { _id: string; role: string }) => {
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
