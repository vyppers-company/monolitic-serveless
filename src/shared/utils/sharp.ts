import sharp from 'sharp';

const composite = async (file: Buffer, BufferWaterMark: Buffer) => {
  return sharp(file.buffer)
    .composite([
      {
        input: await sharp(BufferWaterMark).resize(240, 80).toBuffer(),
        gravity: 'southeast',
      },
    ])
    .toBuffer();
};
const blur = async (file: Buffer) => {
  return await sharp(file.buffer).blur(10).toBuffer();
};

export { composite, blur };
