import { IContentEntity } from 'src/domain/entity/contents';
import { IProfile } from 'src/domain/entity/user.entity';

const decideContent = (doc: IContentEntity, myId) => {
  const { _id } = doc.owner as IProfile;
  if (String(_id) === myId) {
    if (doc.plans.length) {
      return doc.contents;
    }
    return doc.contents;
  }
  if (doc.plans.length) {
    const isInSomePlan = doc.plans.some((plan) => {
      return plan.subscribers.some(
        (user) => user.vypperSubscriptionId === myId,
      );
    });
    if (isInSomePlan) {
      return doc.contents.filter((image) => ({ ...image, blockedThumb: null }));
    }
    return doc.contents.filter((image) => ({
      ...image,
      content: null,
      thumb: null,
    }));
  }
  return doc.contents.filter((image) => ({ ...image, blockedThumb: null }));
};

export { decideContent };
