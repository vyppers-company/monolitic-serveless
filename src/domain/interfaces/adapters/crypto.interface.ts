export interface ICrypto {
  encryptText: (text: string) => string;
  decryptText: (text: string) => string;
}
