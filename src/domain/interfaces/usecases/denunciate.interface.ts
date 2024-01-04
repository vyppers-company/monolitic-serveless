export interface IDenunciateUseCase {
  send(myId: string, contentId: string, reason: string): Promise<void>;
}
