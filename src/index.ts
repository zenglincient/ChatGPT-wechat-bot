import { WechatyBuilder } from 'wechaty'
import { ChatGPTAPI } from 'chatgpt'
import fs from 'fs'
import path from 'path'
import { dirname } from 'path';
import pTimeout from 'p-timeout'
import qrcodeTerminal from 'qrcode-terminal'
import {speechToText} from './audio'
import axios from 'axios'
import {
  createReadStream,
}from 'fs'

const config = {
  AutoReply: true,
  MakeFriend: true,
  ChatGPTSessionToken: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..cSSXLYwEEiZ0t2O1.bVrSYUrz3JnpGgIhSST-_FkDR6atDl9A7dtFBHKt87cZTZe4vyABC_RvrWtbBEen9u3OzIz0WObm4ebVvTMlPooMC-g8vZBdY9rGmOtn82w8GKnyfsQtiKpieCPcJmuprBQgA8ZvCcykSA907T0TVxlZQtb6EdYfHgFen0ncCjCYcPrGcoLap0mLhXr3agsZFagIPN-dqPD1ZBFqfpCQRfYsCcHDfIuCJ3yvxsHAKzIV4whhQzSQxA9AobRFL6XlfQgsXb_dOA57SsQBjFcuRGmqYOaTKXCGYYJM5f8oDudkMpN7QcxhgEVXY27x-qv090eS8hMVb8e8F0KSHEykn7nfJraPXz0p07iGndaBOMc4MEZxVMczpedgwsn7WvmuYh0-uxkOr1FXa6hsyvqmMTVwnWMx57JpGYyP7p9jCoDDyMiCi77t4ioEzviwRo6IrSMKkQbSPtE1VaXlP-uhzWeaJegguGLW0oPM_JMBV1AP7sDpbSpEzlReh_xJaCNLcGj77gm7ORy3zG_ncguZPVMrGoC_0jdp4rEYWHgCpwvKsyS3vs1iIw8_q0rM3tpgYuTRrY3AEyKVKkds21ppiAvraNHYMSfdQgr6Cg8lNPwz8lSExJUwhyw1RBzfstKcvTiHE5mhppPcgn_MHwUeCH-0KhbqCNAawnFvsOwat2hDv-PV2I0PW_h_e7lpETAdZ2qTNjP3XiEXUQZ-Y8Xm1C0cODtHnJggbbI66_x9BBZIgYOCO74hN7EOJCnm1I-DapGYZqUvm30KG-D-T3AWKFqOlIfl1wYo_mWhpPeesf9IMG1pjMHo8EFt-z3DTehsTyFXXyjP-4h7KLkqlO5iXjxQ-4D4X2K4uhSD-7DXlz1ZPXc9k4oLYCl55UmJ6LeqzjLbKNBe7l5uyxX9m7yR2gKjz0uLcCZIIdSpY5jRdX5Z4zVqZdyTE5lo_5j6bUPBKZ9HWRaHSy9a8SyL6-7hMYXzKiOUhxgfFi98cZXJhbQAVaYtf0UGqFUgOgLiVCzVpX_xTHz0dqewgbzgyjCpJ8HDlVSqcTI49_lyUMgaJCB28uv_HAnf-RFkVqYB35HG7dOgLATwNz__gEdrR6ObZUT2UIW4gfAP031S0AwcijuS9c0iQfjAzGSytnfXQRnPLJLwoL1le5m6QEvjITTDky7lBflLk5i7yqPaQg7y4bzRn8XG4rinPStPtdghs8eKJ_bQ8CDfRPoLPlZEB61wBNPatoHVvAjoZix8mYXIdfVVq8zcd-48cdihIW3HR0_FmY95yRqllM3ZtR6Ycpgk_mLQXWAyL4wpo9e_eG9jH3rROYbRsrPNICZvzyYY8S4FaqDvkY0Uxt4Nx0Qk5eyQjhxREVyqtTBnliXgL4kBABBsA-0mlQPQbaz1LnDP8_tBYJbyZi7VYm_7AvAq_n0dFQp0TaB1rkc1L0kPn1T2OcIN_sW7R8lwJtTDlz7luYig7d4VNvO38yZnsuCTLtUFnmKgyv9Jk1DYly3wp0IDrzc3M_tlw-KYjDo1tcnW9itqgxBMYa72EyE-nc9HYsm3b__Y2RTuNr4KnL6rZPawHT_OytKKb65yJyYrJEA2NohQ_svCEpv9B5KPylaoPmHINJX-mcwDMxBfFvLiSj2_I3rIKEQejxyYrFKfy1r-n-sCTafdOEWfdJ-GvXylyfU_BQm9axdla-S0TlAZpvqCAsE4PEV3e_pzulpW4Q4emqRdU1HZ9DOxIouLFBzQr54qHXYZOucbaK2Gc41tfOWAJ27azuX7bX_TQzSRobQpIjK6rFLDoNxqxjcnRFNARTZGZPFMDPvTSKerWWfPjQRfzOXQ4H2z7XvUrXVsT2GrKkHd505lbxcmP6-XfaYQo2PbEvTB5pgeLLDPJmOaSiLQttFMXMvf038xZqS4dF4JGd46mnEmgCXIgFikL3HE9aTMbHXD3xXD1uDWvqqsfbinyPsd1xYI0-zw7pltekl9jQvlQo-7D63AdreE0kS0mTszX3JYYT9Yr8GexN0oi7doI-lMMboNOZXN7XX5mCLMOEmsXCz4xNd6KHYLebVN4Fj2q-DVQAkHetiXKi62NPAgZD6AlzKsmeNu3RIXZU7EXsMvhu0BK6cZCSbSyabLIfv6AY1RTW-gaW240LAJsymJayKKDARcVU-bMGD1_1_cUKOqFA0Y-wWDEC8vQ1z4A3HTQuV6F8YXjlsfQhHkDF9y37u0PONtbtFUoeS77X8kRfzJYOu0NfCs._DCbIRCOWFEsx3fspL62KA'
}


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


async function getChatGPTReply(content) {
  const api = new ChatGPTAPI({ sessionToken: config.ChatGPTSessionToken })
  // ensure the API is properly authenticated (optional)
  await api.ensureAuth()
  console.log('content: ', content);
  // send a message and wait for the response
  //TODO: format response to compatible with wechat messages
  const threeMinutesMs = 2 * 60 * 1000
  let response
  response = await pTimeout(
    api.sendMessage(content),
    {
      milliseconds: threeMinutesMs,
      message: 'ChatGPT timed out waiting for response'
    }
  ).catch(e => {
    response = '欧。超时了，你要不要在问我一次'
  })
  console.log('response: ', response);
  // response is a markdown-formatted string
  return response
}

async function replyMessage(contact, content)  {
  const reply = await getChatGPTReply(content);
  try {
    await contact.say(reply, contact);
  } catch (e) {
    console.error(e);
  }
}

async function onMessage(msg) {
  const contact = msg.talker(); 
  const receiver = msg.to(); 
  const content = msg.text();
  const room = msg.room(); 
  const alias = await contact.alias() || await contact.name();
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
    replyMessage(contact, content)
    fs.unlinkSync(filename)
    return
  }

  if (room && isText) {
    const topic = await room.topic();
    console.log(`Group name: ${topic} talker: ${await contact.name()} content: ${content}`);
    if (await msg.mentionSelf()) {
      const [groupContent] = content.split(`@${receiver.name}`).filter(item => item.trim())
      replyMessage(room, groupContent)
    }
  } else if (isText) {
    console.log(`talker: ${alias} content: ${content}`);
    if (config.AutoReply) {
      if (content) {
        replyMessage(contact, content)
      }
    }
  }
}


function onScan(qrcode, status) {
  qrcodeTerminal.generate(qrcode); // 在console端显示二维码
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('');

  console.log(qrcodeImageUrl);
}

async function onLogin(user) {
  console.log(`${user} has logged in`);
  const date = new Date()
  console.log(`Current time:${date}`);
  if (config.AutoReply) {
    console.log(`Automatic robot chat mode has been activated`);
  }
}

function onLogout(user) {
  console.log(`${user} has logged out`);
}
async function onFriendShip(friendship) {
  const frienddShipRe = /chatgpt|chat/
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
    uos: true
  }
})

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage)
if (config.MakeFriend) {
  bot.on('friendship', onFriendShip);
}


bot
  .start()
  .then(() => console.log('Start to log in wechat...'))
  .catch((e) => console.error(e));

