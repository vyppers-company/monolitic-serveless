const isSubscriptor = (planId, myId) => {
  if (planId.length) {
    const isInSomePlan = planId.some((plan) => {
      return plan.subscribers.some(
        (user) => user.vypperSubscriptionId === myId,
      );
    });
    if (isInSomePlan) {
      return true;
    }
    return false;
  }
  return false;
};

export { isSubscriptor };
