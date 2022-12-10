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
  ChatGPTSessionToken: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..cvfMQIytPjR_wYMC.Z7XT_aVdwtGG4AXYCefJBFM_de3LCbBrlFH9iiIKOxvAOCfoJbIwvrIYQvvtVkZ7Drll9cRKT990wbDiT710niabim_jicxqy0BIPIz_y6THPGnExf-ORUjUWexYh2c25Q1tebWYHOPc-evRD0rWWnSCb1bKSCypRQpJOF9M1Zli_IEP8L6Bm3OJy_-Vh7Fojn1ta0NhsROl-BUxDBZlX8CRXD07NYrZLuu5e3HD0sLJTQxLtH8e0rLLdOBNhAFOfPwt9y4s_xSCBZJcduchJMVtTEHmCIahYfzaIB-Ix9TpQ0d_P_y6Y3V_C6anPtrgIaA1YyjRAyssm-prkeHqwZQDglWDPA4ql561nim-Dqd4t80qCbI5zH3ZuZTY-BrtOft7QGxMojGKAUmnnawtA1Km7wfC03ZSx8uAUauWg8uARZIi6w3SeMBI1BwxO4XIHfy67DFMq5oWrtCQ15GbyO-LyQwEY77hVqJVOme4rvBSfxlmGv715f7u7uByuE8xQCfdFHe7syCIEMXddc8jHRpaG_CvvF9yAL6JvftMhxso8Cx68lvCoZolunGj2i1od6id1TTGvJuNZQ6xNrzlH6r2-0DWjCSLDvnACexAgV6WUnHvj9kGE9WRYzSnrO3EoHhrkRZitUrLKY8kd7Ii_toksQd7P2outWjsp-wbRdBcTFqqVrU61lnjHks2mQqXsk_y8jLByq6fr9EYzLXlAYDG9ZrFSgTGNupW2kEIPkipJn4J9EUlJmlYVvn0830iffOfw_W1caLvrPiZrOcU__z08d4XIJmFf76pQznwe4hGoGXPoejbXBCBeGSCIUWLd67GakFKmk70J6Xbja5FMf6wf5eAHQ5bXmKICsbCx89miF2r_Ok1mL2ouh-Hm4NHOL53qPR17hnND3idBPhliwRBxoT5Fb6i_gMfnmojYtbncVCnZqfm0G5w9_G3ykj_-Vlqk_tY7t9eCiA-96gQNz95TyPXEBz6PqSTdE_KdPd29RNBUmJ-xyvva_i4p3H2KXdKRcxQ5dC_oYccGZXM0TKiGgQQ2VlcGfIztMUqspH34I6qqMGOkjDUgxtrQmWmQo7TWaChdXsRSUSkjFGqnbcn_I7XvdH6--PiVKS2Z_1McoT_sJ-zXboqoAATcEIbiyB_u90Eju5u0tffOIYZjYMTkgQWrGSISy99WjqhnXy6XYkMcp6sU90qzmJ2MndsTaOwO-tAPeGISmtjVia67ireec4Ifydk8Sc-vK_ztlvVwALxIoSbxb35JbJq5i3eZA38fTet6qVRmvG59EaLyJzQ-taqfi-gQ_sDiKr7UN6z5igsAYO84AGxurPuEg0EtdaOwagwZwScPzxCOu7l4tDzk5ZMu2lPauXJxsdvS3vNZgTjmwFAzjJiKKQmPHNmwusHYUZe0k1JzwOrx_RjTA_uFUWFZuGrV7sLfPiQsIOu2xKoFyNpqr36HewlWUZG7jabY04s-VPE_-XSMI4EAc5vkTjHejOd5SFOVi16Dj7Lpipw5bcr8ImRjRftOXi8lnKSWHGCXmxe1DvmbviBzeH_bVb_NhyIIulNjaMQtDxy1ft-GXFUhtPt5M7wjKLEk_TCuBnqj0BjYsmFSyLWnhkB7Tx-x8v12xWFtLsPEj7EGSmPxTnY4OHqo7cEpU3L89e5GoaiZFeDEBVggPkEbCS6cGyiMpIeXEQr5a8iHCOFZ9dehDeO--7W6wEHOj9xa9NBWFvVRfZPnSSCy31w2QJQnWHhNC1UqHlHnIgjQRLBWcua6fTxYyGJIzB2YQJeBTqcctyUkA-CbgnMSVqTRewb6fL1ExOtrc1JdT1Ouw6gPCPBwIadoqwYbE5zilI0q7Nf_NU_fRuZ4mxA8PV4ObHjjylVOBYQVjQC6yuUbOzfibEVez8OAwNh-kd2ryqaS-wYdQpsEU9jeVXrEViV9GGS_kLu1i7Q7oTfszLg65iL9_dbxyQl5f3kBbFkNty_GcpizESOd76WLzKlD-ZlkkfN2-HYS2AB6H_mHamOXoH6AOGJmV-9GpiDEwGqtoQUxfQ6PLL-OL68BNhgv1nl_ZuKGk6Pc3GbcRk-zwl5yiKHBzpP7-6ac6I2j3U9lYkkvkMCQSTJRYRH-F-5c7JpVlt_FZlOCopx4x6xoWTMHeL_htX3GsgO375NUZ0bo3YMIsJAgqsF5OOHGg-n_ZRplIt0B18zKzEVRqdBSr-CGmvInzxJicIbJ6GxKM1ecacBbyTJSOH1udtg9cFWHOYifA15ipXmYUBBhCF2-HX3SZ5b7SyMTXCd_jyRhvPkgy9ERadlpYVV3cZxUiWbU8T4YC2M1OT8sgZ1oktR4g50M7dh5YVJ_I9KTJjGIOpGdvwS.7gHEtNpT5kk09WPAIMrMig'
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


async function getChatGPTReply(content, contact) {
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
      message: 'ChatGPT timed out waiting for response',
      fallback: () => {
        contact.say('欧！请求超时了，我再想一想怎么回答你', contact)
        replyMessage(content, contact)
      }
    }
  )
  console.log('response: ', response);
  // response is a markdown-formatted string
  return response
}

async function replyMessage(contact, content)  {
  const reply = await getChatGPTReply(content, contact);
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

