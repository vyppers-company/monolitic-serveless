export interface IValidateCompleteProfile {
  validateMissingDatas: (userId: string) => Promise<string[]>;
}
