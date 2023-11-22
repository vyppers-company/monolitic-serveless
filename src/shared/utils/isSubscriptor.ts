const isSubscriptor = (plans, myId) => {
  if (plans.length) {
    const isInSomePlan = plans.some((plan) => {
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
