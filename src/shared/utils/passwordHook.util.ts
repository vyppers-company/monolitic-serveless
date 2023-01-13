import { compareSync, hashSync } from 'bcryptjs';

export const hashPassword = (password: string) => {
  const hashedPassword = hashSync(password, 8);
  return hashedPassword;
};

export const checkIfUnencryptedPasswordIsValid = (
  encrypted: string,
  password: string,
) => {
  const matchPassword = compareSync(password, encrypted);
  return matchPassword;
};
