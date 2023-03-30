export interface IChangePasswordDto {
  code: string;
  emailOrPhone: string;
  newPassword: string;
  confirmNewPassword: string;
}
