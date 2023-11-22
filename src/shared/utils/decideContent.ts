const decideContent = (doc, myId) => {
  if (String(doc.owner._id) === myId) {
    if (doc.plans.length) {
      return doc.contents;
    }
    return doc.contents.filter((image) => !image.includes('-blocked'));
  }
  if (doc.plans.length) {
    const isInSomePlan = doc.plans.some((plan) => {
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
