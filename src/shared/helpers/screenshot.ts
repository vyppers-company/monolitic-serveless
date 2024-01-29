import path1 from '@ffmpeg-installer/ffmpeg';
import path2 from '@ffprobe-installer/ffprobe';
import { randomUUID } from 'crypto';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfprobePath(path2.path);
ffmpeg.setFfmpegPath(path1.path);

async function captureScreenshotFromS3(s3url) {
  const randomName = randomUUID();
  await new Promise((resolve, reject) => {
    try {
      ffmpeg()
        .input(s3url)
        .on('end', function () {
          console.log('Miniatura gerada com sucesso.');
          resolve(true);
        })
        .screenshot({
          count: 1,
          timestamps: [1],
          filename: `${randomName}.jpg`,
          folder: './',
        });
    } catch (error) {
      reject(error);
    }
  });
  const buffer = fs.readFileSync(`./${randomName}.jpg`);
  fs.unlinkSync(`./${randomName}.jpg`);
  return buffer;
}
/* const makeABlurCutVideo = async (s3url) => {
  const result = await new Promise((resolve, reject) => {
    ffmpeg()
      .input(s3url)
      .setDuration('2s')
      .output('./output.mp4')
      .save('./output.mp4')
      .on('progress', (data) => {
        console.log('Video gerando...', data);
      })
      .on('end', function () {
        console.log('Video gerado com sucesso.');
      })
      .run();
  });
  return result;
}; */

export { captureScreenshotFromS3 /* makeABlurCutVideo */ };
