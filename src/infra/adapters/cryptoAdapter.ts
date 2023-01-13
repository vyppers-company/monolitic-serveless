import { ICrypto } from '../../domain/interfaces/adapters/crypto.interface';
import { Buffer } from 'node:buffer';
import { environment } from '../../main/config/environment';
import { createCipheriv, scryptSync } from 'crypto';

export class CryptoAdapter implements ICrypto {
  encryptText(text: string): string {
    try {
      const keyPass = environment.cryptoData.keyPass;
      const keySalt = environment.cryptoData.keySalt;
      const keyLength = environment.cryptoData.keyLength;
      const cipherString = environment.cryptoData.cipherString;
      const bufferSize = environment.cryptoData.bufferSize;
      const bufferFill = environment.cryptoData.bufferFill;
      const iv = Buffer.alloc(bufferSize, bufferFill);
      const key = scryptSync(keyPass, keySalt, keyLength);
      const cipher = createCipheriv(cipherString, key, iv);
      return Buffer.concat([cipher.update(text), cipher.final()]).toString(
        'base64',
      );
    } catch (error) {
      throw error;
    }
  }
}
