export interface IChangePasswordDto {
  tokenCode: string;
  newPassword: string;
  confirmNewPassword: string;
}
