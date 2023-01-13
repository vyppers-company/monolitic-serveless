const correctDateNow = () => {
  const now1 = new Date();
  const now = new Date(
    Date.UTC(
      now1.getFullYear(),
      now1.getMonth(),
      now1.getDate(),
      now1.getHours(),
      now1.getMinutes(),
      now1.getSeconds(),
    ),
  );
  return now;
};
export { correctDateNow };
