export interface ISendEmailAdapter {
  sendEmailCode: (to: string, code: string) => Promise<void>;
}
