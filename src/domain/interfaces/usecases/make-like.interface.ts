export interface IMakeLikeUseCase {
  makeLike: (contentId: string, myId: string) => Promise<void>;
}
