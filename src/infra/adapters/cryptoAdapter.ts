import { ICrypto } from '../../domain/interfaces/adapters/crypto.interface';
import { Buffer } from 'node:buffer';
import { environment } from '../../main/config/environment';
import { createCipheriv, scryptSync } from 'crypto';
import { createDecipheriv } from 'node:crypto';

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
  decryptText(encryptedText: string): string {
    try {
      const algorithm = environment.cryptoData.cipherString;
      const key = scryptSync(
        environment.cryptoData.keyPass,
        environment.cryptoData.keySalt,
        environment.cryptoData.keyLength,
      );
      const iv = Buffer.alloc(
        environment.cryptoData.bufferSize,
        environment.cryptoData.bufferFill,
      );
      const encrypted = Buffer.from(encryptedText, 'base64');
      const decipher = createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (error) {
      throw error;
    }
  }
}
