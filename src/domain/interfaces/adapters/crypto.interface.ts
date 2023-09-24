export enum ICryptoType {
  'CODE',
  'USER',
}

export interface ICrypto {
  encryptText: (text: string, type: ICryptoType) => string;
  decryptText: (text: string, type: ICryptoType) => string;
}
