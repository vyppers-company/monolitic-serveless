import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  names,
} from 'unique-names-generator';

const generateName = (existentValues: string[]) => {
  const randomName = uniqueNamesGenerator({
    dictionaries: [animals, adjectives, colors, names],
    separator: '_',
    length: 3,
  });
  if (!existentValues.includes(randomName)) {
    return randomName;
  }
  generateName(existentValues);
};

export { generateName };
