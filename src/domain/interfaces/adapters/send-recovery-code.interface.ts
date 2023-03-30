export interface ISendRecoveryCode {
  send: (to: string, code: string) => void;
}
