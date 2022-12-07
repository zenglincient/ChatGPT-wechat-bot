import { WechatyBuilder } from 'wechaty'
import { ChatGPTAPI } from 'chatgpt'
import pTimeout from 'p-timeout'
import qrcodeTerminal from 'qrcode-terminal'

const config = {
  AutoReply: true,
  MakeFriend: true,
  ChatGPTSessionToken: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..gdbcxL8UcvQnbSGt.PK_mlVO6Ox2M2rVwx1vxf1p-nPx4F9NakLuFlfdaMtQIc7o_dL98-dLX4px8hEzHM-BLB3zMc5UOuvcHe-uF0E8Jsw2HOCSUUlUHRWAqhOyKR91mr3Z2zCJEEnC_-VQt_YUfoNwajVg7j6PozznL2MwngBVV10yBUHv-KPPE9ROO6l6VUT675hFEAznSmz0nov_cOo90ze0WIp5BR8oUZbDa1C8atgguQU4G3Gvvrf15iOoAm9MYhVkAi15ouXuIce6v-5csW_eQvrH_lnwg2jQNrg16gm6bCUSaQwGJNZUM7L9CgOhlZ2r-6gb7UW8LZOXPJetQRQ8V1TN5LCp0A2ISDJDIAiVibFAVn7XYniZHnlP0NOf-LWgBeMhJ_Jw4zpngx0Ed0skeh1CIpoyOTgoiA1tBi0zozTTD2Xnve3T7HbLSZRQAdI2roRkldiNX5swYY-WIfWQER1MpeeqlpJbknUbCHHeG8ccqIkNBtbqlH_UQYhomma0yTLc9S4uHPbmjW53u1_A_4J7pqOcX9a2tawSq3EK25_q_buSeqhEK8F65T9CAPA62xM3Lnwv6AKww_3nKYJug7N07I76DGlf3-EvjO-f15k-yfq7DEPxiMo-d1JHtDmjozS2g7y4jv2z7W56fimGgroGUxAwh8k7DLYLvV_M1DJdJ4L_5Gdvua9XYkhvQGw1N5Pe5rwAOkEMdIYcAZ711Dvk7BUnQ5jyXM1Lz0pghYE-IoqpbVuce3ug5G_1MpySTGDmIXXAvQdQ9acrqkoc4Ztme3mxuEFm4mtnRAwQ5Zb1Wa_ixZX3StpyVROcURq--cXn9NI_lKvPo6H8N_rI2Av3xajmbU3RQxEB8tMEsd27RTqRpccL9gioaPCt4GIJwtqhWV79cjqqyds98GZvA7hVrI5ktkIeA8kgZ5uufc57PmmpgNl0u33zBjEwshAgZzdHLJPI1WQy8Au-ohzcoOvs2PC_OnOvzdwVhVoNTAaf4NdzzMwD4YsHcbv98c-0bb7I66DmYK3hSwYNhUc_vagGt0v_te5q3FaCbAhUJJ9NDRA5oSOjloHfJ282t2alKNJ4_i_ZbcQ4MKVEqs2ftOspSB-57ERMDp_OFxCJjezFjOrBEd3uyBnvw2EpuPns3O1kK4RmSzRPg8VAGDe6nntUQ-3gwDS9VoNr3qjxdi9oP17ux-mm7eqLrQafUPBIzk7yEwajrLdcIRLngoTP-kDx9oF_s6IHp7_FHLd3DT6Ygw6nHPBBReaeX0nAz8SJ_W2S-vWyMuNgmtbA5mtx0bz8dpZXPa_mcf5IJdlwroZ5D-nW6IeLSZ8rmDaEud43izlMBbSgm2cJOgHtz33g-bXSrooGD_f4dXmB1rvDVG018j1nGSFrBQBUW0JzOZRqanL0ur7RvrxSigTz72cLu2SDrG3Orek2Ln6Jqs79FpD0ZMUNL4SvDDeh4wMmv6n5bWPyaFkC60VuxeXbXbLIIaIERMcgvo5XheDbU7GFPCrfjLAFL8-5wlbT0EwXXlscMmw1vqVQwoDUY9xjw1U5jWocn4XKlF73dxLZTgPhwn85J0Jcw4DDE9SglJ0ezdS-n2ASsbOjvr_ZLKVBceiEgXmL18FDPSm6z2O7Bi_m-iMTj_mAjx9gWLQjWY883kdWOF4-3I4LvboUqW3i3HilajaBBoXb5RfEsn1JNNOvCTgHlz9jBS80bJ1nDH8aJ-cghAmCQsauiWB2u0RD6IQQacUV8Q5GV3QChLcJsIu05fJjIGgAJy1K0ILQHLufdDI2ECAQJsCvS5sPFQY7kUfKpiQxUxCTMkHHFFs77Po_xsbYoWUxII32VmusQzucLAtE77si7QeIJ6DhC-RgqC3tBCQu_v6PB6Odm5m61DFS3GMpQhst6CbqLPuWRIUVuAC6umu95Us-7b9h142EgI5s9iGjEthVRbbN74gWJeZ7BhgioLW3fDYD-OqbyXxPMsTV0-JrY61wa91dP-zEu-vNEICSmaSbnETc16cQ-7B_NcEoyDH3_Bfic7XjAOoZrQFunokhP5Ea9le73nxbiqDETKQFnYw0frFOVMmydqPqs2t6xVRylNkYNjvwlqnETxK9eUI2MJbMOo7J4zCWDEhtPSSBjFkdvt_skNZsa6nrTITgn1PWaug_Vz20h-sPiR2G9bRmLmChBspLBabuUVx5L9fvX-MmKtMOx-LyqEd38GajP28k-HA8FwspWv6xURbTtXxEvI8ud7J-kubQk.XogKKK4RUmiB4aMBpPV2YA'
}

async function getChatGPTReply(content) {
  const api = new ChatGPTAPI({ sessionToken: config.ChatGPTSessionToken })
  // ensure the API is properly authenticated (optional)
  await api.ensureAuth()
  console.log('content: ', content);
  // send a message and wait for the response
  //TODO: format response to compatible with wechat messages
  const threeMinutesMs = 3 * 60 * 1000
  const response = await pTimeout(
    api.sendMessage(content),
    {
      milliseconds: threeMinutesMs,
      message: 'ChatGPT timed out waiting for response'
    }
  )
  console.log('response: ', response);
  // response is a markdown-formatted string
  return response
}

async function replyMessage(contact, content) {
  const reply = await getChatGPTReply(content);
  try {
    await contact.say(reply);
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
  if (msg.self()) {
    return;
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


