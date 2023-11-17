const decideContent = (doc, myId) => {
  if (doc.plan) {
    if (doc.plan.subscribers.length) {
      const isSubscriber = doc.plan.subscribers.some(
        (item) => item.vypperSubscriptionId === myId,
      );
      if (isSubscriber) {
        return doc.contents.filter((image) => !image.includes('-blocked'));
      }
    }
    return doc.contents.filter((image) => image.includes('-blocked'));
  }
  return doc.contents.filter((image) => image.includes('-blocked'));
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
