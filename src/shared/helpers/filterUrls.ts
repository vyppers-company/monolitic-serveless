import { URL } from 'url';

function filterUrls(strings: string[]) {
  const validUrls = [];
  const invalidUrls = [];

  strings.forEach((string) => {
    try {
      new URL(string);
      validUrls.push(string);
    } catch (error) {
      invalidUrls.push(string);
    }
  });

  return { validUrls, invalidUrls };
}

export default filterUrls;
