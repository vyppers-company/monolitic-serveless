export const groupBy = (array, fieldName) => {
  const resultDictionary = {};

  array.forEach((subArray) => {
    subArray.forEach((element) => {
      const key = element[fieldName];

      if (!resultDictionary[key]) {
        resultDictionary[key] = [];
      }

      resultDictionary[key].push(element);
    });
  });

  return resultDictionary;
};

export const groupBySimple = (arr: any[], key: string) => {
  return arr.reduce(
    (result, item) => {
      const groupKey = item[key];

      result[groupKey].push(item);
      return result;
    },
    { APPROVED: [], WAITING: [], FAILED: [] },
  );
};
