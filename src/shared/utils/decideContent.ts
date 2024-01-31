import { IContentEntity } from 'src/domain/entity/contents';
import { IProfile } from 'src/domain/entity/user.entity';
import { randomUUID } from 'node:crypto';

const decideContent = (doc: IContentEntity, myId) => {
  const { _id } = doc.owner as IProfile;
  if (String(_id) === myId) {
    if (doc.plans.length) {
      return doc.contents.map((item) => ({ ...item, _id: randomUUID() }));
    }
    return doc.contents.map((item) => ({ ...item, _id: randomUUID() }));
  }
  if (doc.plans.length) {
    const isInSomePlan = doc.plans.some((plan) => {
      return plan.subscribers.some(
        (user) => user.vypperSubscriptionId === myId,
      );
    });
    if (isInSomePlan) {
      return doc.contents.filter((image) => ({
        ...image,
        blockedThumb: null,
        _id: randomUUID(),
      }));
    }
    return doc.contents.filter((image) => ({
      ...image,
      content: null,
      thumb: null,
      _id: randomUUID(),
    }));
  }
  return doc.contents.filter((image) => ({
    ...image,
    blockedThumb: null,
    _id: randomUUID(),
  }));
};

export { decideContent };
