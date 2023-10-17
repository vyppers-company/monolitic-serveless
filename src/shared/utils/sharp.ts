import sharp from 'sharp';

const composite = async (file: Buffer, BufferWaterMark: Buffer) => {
  return sharp(file.buffer)
    .composite([
      {
        input: await sharp(BufferWaterMark).resize(250, 90).toBuffer(),
        gravity: 'southeast',
      },
    ])
    .toBuffer();
};
const blur = async (file: Buffer) => {
  return await sharp(file.buffer).blur(30).toBuffer();
};

export { composite, blur };
