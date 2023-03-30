export const generateCode = () => {
  const one = Math.floor(10 * Math.random());
  const two = Math.floor(10 * Math.random());
  const three = Math.floor(10 * Math.random());
  const four = Math.floor(10 * Math.random());
  const five = Math.floor(10 * Math.random());
  const six = Math.floor(10 * Math.random());

  return {
    value: `${one}${two}${three}${four}${five}${six}`,
    formated: `${one}${two}${three}-${four}${five}${six}`,
  };
};
