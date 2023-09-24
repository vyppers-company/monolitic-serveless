export interface IValidateProfileId {
  validate(profileId: string): Promise<boolean>;
}
