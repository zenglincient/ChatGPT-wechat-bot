import path from 'path';
import Mp32Wav from 'mp3-to-wav';
import request from 'request';
import querystring from 'querystring';
import Ffmpeg from 'fluent-ffmpeg';
import {
  // createWriteStream,
  createReadStream,
} from 'fs';
const __dirname = path.resolve();
import { PassThrough, Readable } from 'stream';

const mp3Stream = createReadStream(path.join(__dirname, 'input.mp3'));

const wavStream = new PassThrough();
Ffmpeg(mp3Stream)
  .fromFormat('mp3')
  .audioBitrate('16k')
  .toFormat('wav')
  .pipe(wavStream);

wavToText(wavStream).then((res) => {
  console.log(res.toString());
});

function wavToText(wavStream) {
  const params = {
    cuid: 'wechaty—asui ',
    dev_pid: 1537,
    token:
      '24.9a3d5c0f1a1f623afc090a995dcbf0cb.2592000.1673001909.282335-28899264',
  };

  const apiUrl =
    'http://vop.baidu.com/server_api?' + querystring.stringify(params);

  const options = {
    headers: {
      'Content-Type': 'audio/wav; rate=16000',
    },
  };

  return new Promise((resolve, reject) => {
    wavStream.pipe(
      request.post(apiUrl, options, (err, _ /* httpResponse */, body) => {
        // "err_msg":"success.","err_no":0,"result":["这是一个测试测试语音转文字，"]
        if (err) {
          return reject(err);
        }
        try {
          const obj = JSON.parse(body);
          if (obj.err_no !== 0) {
            throw new Error(obj.err_msg);
          }
          console.log('333', obj.result);
          return resolve(obj.result[0]);
        } catch (err) {
          return reject(err);
        }
      })
    );
  });
}
