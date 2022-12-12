import { WechatyBuilder } from 'wechaty'
import { ChatGPTAPI } from 'chatgpt'
import fs from 'fs'
import path from 'path'
import { dirname } from 'path';
import pTimeout from 'p-timeout'
import qrcodeTerminal from 'qrcode-terminal'
import { speechToText } from './audio'
import axios from 'axios'
import {
  createReadStream,
} from 'fs'
import config from './config';
import { replyMessage } from './chatgpt';

const __dirname = path.resolve();

const getBaiduToken = () => {
  axios.get(
    `https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=hH8MQRrZvUxFLuS59GxcwZQ2&client_secret=PBDmKGwwnKs8Ay84oAlW8Eur3TI3tl6O`
  ).then(res => {
    console.log(res.data);
    process.env.baiduToken = res.data.access_token;
  })
}
getBaiduToken();

setInterval(() => {
  getBaiduToken()
}, 1000 * 60 * 60 * 12 * 14)


async function onMessage(msg) {
  const contact = msg.talker();
  const contactId = contact.id;
  const receiver = msg.to();
  const content = msg.text().trim();
  const room = msg.room();
  const alias = (await contact.alias()) || (await contact.name());
  const isText = msg.type() === bot.Message.Type.Text;
  const isAudio = msg.type() === bot.Message.Type.Audio;
  if (msg.self()) {
    return;
  }

  if (isAudio && !room) {
    const msgFile = await msg.toFileBox()
    const filename = msgFile.name
    await msgFile.toFile(filename)

    const mp3Stream = createReadStream(path.join(__dirname, filename))
    const content = await speechToText(mp3Stream)
    contact.say(`识别到您的语音输入为：${content}`)
    replyMessage(contact, content, contactId)
    fs.unlinkSync(filename)
    return
  }

  if (room && isText) {
    const topic = await room.topic();
    console.log(
      `Group name: ${topic} talker: ${await contact.name()} content: ${content}`
    );

    const pattern = RegExp(`^@${receiver.name()}\\s+${config.groupKey}[\\s]*`);
    if (await msg.mentionSelf()) {
      if (pattern.test(content)) {
        const groupContent = content.replace(pattern, '');
        replyMessage(room, groupContent, contactId);
        return;
      } else {
        console.log(
          'Content is not within the scope of the customizition format'
        );
      }
    }
  } else if (isText) {
    console.log(`talker: ${alias} content: ${content}`);
    if (config.autoReply) {
      if (content.startsWith(config.privateKey)) {
        replyMessage(
          contact,
          content.substring(config.privateKey.length).trim(),
          contactId
        );
      } else {
        console.log(
          'Content is not within the scope of the customizition format'
        );
      }
    }
  }
}

function onScan(qrcode) {
  qrcodeTerminal.generate(qrcode); // 在console端显示二维码
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('');

  console.log(qrcodeImageUrl);
}

async function onLogin(user) {
  console.log(`${user} has logged in`);
  const date = new Date();
  console.log(`Current time:${date}`);
  if (config.autoReply) {
    console.log(`Automatic robot chat mode has been activated`);
  }
}

function onLogout(user) {
  console.log(`${user} has logged out`);
}

async function onFriendShip(friendship) {
  if (friendship.type() === 2) {
    // if (frienddShipRe.test(friendship.hello())) {
    //   await friendship.accept()
    // }
    await friendship.accept()
  }
}

const bot = WechatyBuilder.build({
  name: 'WechatEveryDay',
  puppet: 'wechaty-puppet-wechat', // 如果有token，记得更换对应的puppet
  puppetOptions: {
    uos: true,
  },
});

bot
  .on('scan', onScan)
  .on('login', onLogin)
  .on('logout', onLogout)
  .on('message', onMessage);
if (config.friendShipRule) {
  bot.on('friendship', onFriendShip);
}

bot
  .start()
  .then(() => console.log('Start to log in wechat...'))
  .catch((e) => console.error(e));
