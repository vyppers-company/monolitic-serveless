const decideContent = (doc, myId) => {
  if (String(doc.owner._id) === myId) {
    if (doc.planId) {
      return doc.contents;
    }
    return doc.contents.filter((image) => !image.includes('-blocked'));
  }
  if (doc.planId) {
    if (doc.planId.subscribers.length) {
      const isSubscriber = doc.planId.subscribers.some(
        (item) => item.vypperSubscriptionId === myId,
      );
      if (isSubscriber) {
        return doc.contents.filter((image) => !image.includes('-blocked'));
      }
    }
    return doc.contents.filter((image) => image.includes('-blocked'));
  }
  return doc.contents.filter((image) => !image.includes('-blocked'));
};

export { decideContent };

/*  doc.contents.filter((image: string) =>
        doc.payed
          ? doc.owner.planConfiguration.subscribers.some(
              (item) => item.vypperSubscriptionId === myId,
            )
            ? !image.includes('-blocked')
            : image.includes('-blocked')
          : !image.includes('-blocked') */
