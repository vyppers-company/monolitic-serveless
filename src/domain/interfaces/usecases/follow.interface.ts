export interface IFollowUseCase {
  makeFollow: (myId: string, userId: string) => Promise<void>;
}
