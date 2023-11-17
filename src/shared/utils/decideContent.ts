const decideContent = (doc, myId) => {
  if (String(doc.owner._id) === myId) {
    if (doc.planId.length) {
      return doc.contents;
    }
    return doc.contents.filter((image) => !image.includes('-blocked'));
  }
  if (doc.planId.length) {
    const isInSomePlan = doc.planId.some((plan) => {
      return plan.subscribers.some(
        (user) => user.vypperSubscriptionId === myId,
      );
    });
    if (isInSomePlan) {
      return doc.contents.filter((image) => !image.includes('-blocked'));
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
