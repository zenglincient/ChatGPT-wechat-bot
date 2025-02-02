import { PassThrough, Readable } from 'stream';

import request from 'request';
import Ffmpeg from 'fluent-ffmpeg';
import querystring from 'querystring';
import { path } from '@ffmpeg-installer/ffmpeg';
import axios from 'axios';
Ffmpeg.setFfmpegPath(path);

const getBaiduToken = () => {
  axios
    .get(
      `https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=hH8MQRrZvUxFLuS59GxcwZQ2&client_secret=PBDmKGwwnKs8Ay84oAlW8Eur3TI3tl6O`
    )
    .then((res) => {
      console.log(res.data);
      process.env.baiduToken = res.data.access_token;
    });
};

export const initAudio = () => {
  getBaiduToken();
  setInterval(() => {
    getBaiduToken();
  }, 1000 * 60 * 60 * 12 * 14);
};

export async function speechToText(mp3Stream: Readable): Promise<string> {
  const wavStream = mp3ToWav(mp3Stream);

  // const textStream = wavToText(wavStream)

  // textStream.on('data', text => {
  //   console.log(text)
  // })

  try {
    const text = await wavToText(wavStream);
    return text;
  } catch (e) {
    console.log(e);
    return '';
  }
}

function mp3ToWav(mp3Stream: Readable): NodeJS.ReadableStream {
  const wavStream = new PassThrough();

  Ffmpeg(mp3Stream)
    .fromFormat('mp3')
    .audioBitrate('128k')
    .toFormat('wav')
    .pipe(wavStream as any)

    // .on('start', function(commandLine) {
    //   console.log('Spawned Ffmpeg with command: ' + commandLine);
    // })
    // .on('codecData', function(data) {
    //   console.log('Input is ' + data.audio + ' audio ' +
    //     'with ' + data.video + ' video');
    // })
    // .on('progress', progress => {
    //   console.log('Processing: ' + progress.percent + '% done');
    // })
    // .on('end', function() {
    //   console.log('Finished processing');
    // })
    .on('error', function (err: Error /*, stdout, stderr */) {
      console.log('Cannot process video: ' + err.message);
    });

  return wavStream;
}

/**
 * Baidu:
 * export BAIDU_SPEECH_API_KEY=FK58sUlteAuAIXZl5dWzAHCT
 * export BAIDU_SPEECH_SECRET_KEY=feaf24adcc5b8f02b147e7f7b1953030
 * curl "https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_SPEECH_API_KEY}&client_secret=${BAIDU_SPEECH_SECRET_KEY}"
 *
 * OAuth: http://developer.baidu.com/wiki/index.php?title=docs/oauth/overview
 * ASR: http://yuyin.baidu.com/docs/asr/57
 */

/**
 * YunZhiSheng:
 * http://dev.hivoice.cn/download_file/USC_DevelGuide_WebAPI_audioTranscription.pdf
 */

/**
 * Google:
 * http://blog.csdn.net/dlangu0393/article/details/7214728
 * http://elric2011.github.io/a/using_speech_recognize_service.html
 */
async function wavToText(wavStream: NodeJS.ReadableStream): Promise<string> {
  const params = {
    cuid: 'wechaty—asui',
    dev_pid: 1537,
    token: process.env.baiduToken,
  };

  const apiUrl =
    'https://vop.baidu.com/server_api?' + querystring.stringify(params);

  const options = {
    headers: {
      'Content-Type': 'audio/wav; rate=16000',
    },
  };

  return new Promise<string>((resolve, reject) => {
    wavStream.pipe(
      request.post(apiUrl, options, (err, _ /* httpResponse */, body) => {
        // "err_msg":"success.","err_no":0,"result":["这是一个测试测试语音转文字，"]
        if (err) {
          console.log('出错啦！', err);
          return reject(err);
        }
        try {
          const obj = JSON.parse(body);
          if (obj.err_no !== 0) {
            throw new Error(obj.err_msg);
          }
          console.log(obj.result[0]);
          return resolve(obj.result[0]);
        } catch (err) {
          return reject(err);
        }
      })
    );
  });
}
