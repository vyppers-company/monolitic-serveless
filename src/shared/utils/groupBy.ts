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
