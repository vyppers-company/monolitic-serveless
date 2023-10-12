import axios from 'axios';

const getImageFromExternalUrl = async (url: string) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data);
  return buffer;
};
export { getImageFromExternalUrl };
