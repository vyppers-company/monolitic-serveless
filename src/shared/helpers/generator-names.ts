import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  names,
  starWars,
} from 'unique-names-generator';

const generateName = (existentValues: string[], length = 3) => {
  const randomName = uniqueNamesGenerator({
    dictionaries: [animals, adjectives, colors, names, starWars],
    separator: '_',
    length,
  });
  if (!existentValues.includes(randomName)) {
    return randomName;
  }
  generateName(existentValues, length <= 5 ? length : length + 1);
};

export { generateName };
