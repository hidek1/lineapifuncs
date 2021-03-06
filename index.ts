require('dotenv').config();
const line = require('@line/bot-sdk');
const express = require('express');
const request = require('request'); 
const imageUrl = 'http://liz-bluebird.com/img/character/natsuki.png';

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);
const app = express();

app.post('/callback', line.middleware(config), (req, res) => {
  const events = req.body.events;
  Promise.all(events.map((event) => {
    const imageUrl = "https://ellachanblog.com/wp-content/uploads/2019/04/blue-blue-sky-clear-sky-2086535-1024x668.jpg";
    const videoUrl = "https://ellachanblog.com/wp-content/uploads/2019/05/1535938239.mp4";
    const audioUrl = "https://ellachanblog.com/wp-content/uploads/2019/05/replyAudio.m4a";
    const quickreplyContent = {
    items: [
      {
        type: "action",
        imageUrl: imageUrl,
        action: {
          type: "message",
          label: "Sushi",
          text: "Sushi"
        }
      },
      {
        type: "action",
        imageUrl: imageUrl,
        action: {
          type: "message",
          label: "Tempura",
          text: "Tempura"
        }
      },
      {
        type: "action",
        action: {
          type: "location",
          label: "Send location"
        }
      }
    ]
  };
  const richMenu = {
    "size":{
        "width":2500,
        "height":1686
    },
    "selected":false,
    "name":"Controller",
    "chatBarText":"Controller",
    "areas":[
        {
          "bounds":{
              "x":551,
              "y":325,
              "width":321,
              "height":321
          },
          "action":{
              "type":"message",
              "text":"up"
          }
        },
        {
          "bounds":{
              "x":876,
              "y":651,
              "width":321,
              "height":321
          },
          "action":{
              "type":"message",
              "text":"right"
          }
        },
        {
          "bounds":{
              "x":551,
              "y":972,
              "width":321,
              "height":321
          },
          "action":{
              "type":"message",
              "text":"down"
          }
        },
        {
          "bounds":{
              "x":225,
              "y":651,
              "width":321,
              "height":321
          },
          "action":{
              "type":"message",
              "text":"left"
          }
        },
        {
          "bounds":{
              "x":1433,
              "y":657,
              "width":367,
              "height":367
          },
          "action":{
              "type":"message",
              "text":"btn b"
          }
        },
        {
          "bounds":{
              "x":1907,
              "y":657,
              "width":367,
              "height":367
          },
          "action":{
              "type":"message",
              "text":"btn a"
          }
        }
    ]
  }
    //ユーザーのfollow,unfollow,messageなどでイベントが発生
    console.log(event);
    if(event.type === 'message' && event.message.type==='text') {
      getProfile(event.source.userId);
      if(event.source.type==='group'){
        getGroupMemberProfile(process.env.GROUP_ID_1, process.env.USER_ID_1);
        // 認証済みアカウントまたはプレミアムアカウントのみで利用可能
        getGroupMemberIds(process.env.GROUP_ID_1);
      }
      if(event.source.type==='room'){
        getRoomMemberProfile(process.env.ROOM_ID_1, process.env.USER_ID_2);
        // 認証済みアカウントまたはプレミアムアカウントのみで利用可能
        getRoomMemberIds(process.env.ROOM_ID_1);
      }
      //挙動のテスト用
      if(event.message.text==='replyText'){
        return replyTextMessage(event, "リプライテキスト").catch(() => { return null; });
      } else if (event.message.text==='replyImage'){
        return replyImageMessage(event,imageUrl ,imageUrl).catch(() => { return null; });
      } else if (event.message.text==='replyVideo'){
        return replyVideoMessage(event, videoUrl, videoUrl).catch(() => { return null; });
      } else if (event.message.text==='replyAudio'){
        return replyAudioMessage(event, audioUrl, 2000).catch((e) => { console.log(e);
          return null; });
      } else if (event.message.text==='replyLocation'){
        return replyLocationMessage(event, "hoge", "〒150-0002 東京都渋谷区渋谷２丁目２１−１", 35.65910807942215, 139.70372892916203).catch(() => { return null; });
      } else if (event.message.text==='replySticker'){
        return replyStickerMessage(event, 1, 1).catch(() => { return null; });
      } else if (event.message.text==='getReplyNum') {
        return getNumberOfSentReplyMessages('20190501').catch(() => { return null; });
      } else if(event.message.text==='pushText'){
        return pushTextMessage(process.env.USER_ID_1, "プッシュテキスト").catch(() => { return null; });
      } else if (event.message.text==='pushImage'){
        return pushImageMessage(process.env.USER_ID_1,imageUrl ,imageUrl).catch(() => { return null; });
      } else if (event.message.text==='pushVideo'){
        return pushVideoMessage(process.env.USER_ID_1, videoUrl, videoUrl).catch(() => { return null; });
      } else if (event.message.text==='pushAudio'){
        return pushAudioMessage(process.env.USER_ID_1, audioUrl, 2000).catch(() => { return null; });
      } else if (event.message.text==='pushLocation'){
        return pushLocationMessage(process.env.USER_ID_1, "hoge", "〒150-0002 東京都渋谷区渋谷２丁目２１−１", 35.65910807942215, 139.70372892916203).catch(() => { return null; });
      } else if (event.message.text==='pushSticker'){
        return pushStickerMessage(process.env.USER_ID_1, 1, 1).catch(() => { return null; });
      } else if (event.message.text==='getPushNum') {
        return getNumberOfSentPushMessages('20190501').catch(() => { return null; });
      } else if(event.message.text==='multicastText'){
        return multicastTextMessage([process.env.USER_ID_1,process.env.USER_ID_2], "マルチテキスト").catch(() => { return null; });
      } else if (event.message.text==='multicastImage'){
        return multicastImageMessage([process.env.USER_ID_1,process.env.USER_ID_2],imageUrl ,imageUrl).catch(() => { return null; });
      } else if (event.message.text==='multicastVideo'){
        return multicastVideoMessage([process.env.USER_ID_1,process.env.USER_ID_2], videoUrl, videoUrl).catch(() => { return null; });
      } else if (event.message.text==='multicastAudio'){
        return multicastAudioMessage([process.env.USER_ID_1,process.env.USER_ID_2], audioUrl, 2000).catch(() => { return null; });
      } else if (event.message.text==='multicastLocation'){
        return multicastLocationMessage([process.env.USER_ID_1,process.env.USER_ID_2], "hoge", "〒150-0002 東京都渋谷区渋谷２丁目２１−１", 35.65910807942215, 139.70372892916203).catch(() => { return null; });
      } else if (event.message.text==='multicastSticker'){
        return multicastStickerMessage([process.env.USER_ID_1,process.env.USER_ID_2], 1, 1).catch(() => { return null; });
      } else if (event.message.text==='getMulticastNum') {
        return getNumberOfSentMulticastMessages('20190501').catch(() => { return null; });
      } else if(event.message.text==='pushTextToGroup'){
        return pushTextMessage(process.env.GROUP_ID_1, "プッシュテキスト").catch(() => { return null; });
      } else if(event.message.text==='pushTextToRoom'){
        return pushTextMessage(process.env.ROOM_ID_1, "プッシュテキスト").catch(() => { return null; });
      } else if(event.message.text==='byebyeGroup'){
        leaveGroup(process.env.GROUP_ID_1);
      } else if(event.message.text==='byebyeRoom'){
        leaveRoom(process.env.ROOM_ID_1);
      } else if(event.message.text==='replyTextQuickReply'){
        return replyTextMessage(event, "リプライテキスト",quickreplyContent).catch(() => { return null; });
      } else if(event.message.text==='createRichMenu'){
        return createRichMenu(richMenu);
      } else if(event.message.text==='getRichMenu'){
        return getRichMenu(process.env.RICH_MENU_ID_1);
      } else if(event.message.text==='getRichMenuIdOfUser'){
        return getRichMenuIdOfUser(process.env.USER_ID_1);
      } else if(event.message.text==='setRichMenuImage'){
        return setRichMenuImage(process.env.RICH_MENU_ID_1, "test111.png");
      } else if(event.message.text==='linkRichMenuToUser'){
        return linkRichMenuToUser(process.env.USER_ID_1, process.env.RICH_MENU_ID_1);
      } else if(event.message.text==='getRichMenuList'){
        return getRichMenuList();
      } else if(event.message.text==='setDefaultRichMenu'){
        return setDefaultRichMenu(process.env.RICH_MENU_ID_1);
      }
    } else if (event.type === 'message' && event.message.type==='image'){
      getMessageContent(event.message.id);
    }
  }))
    .then((result) => {
      res.status(200).json({}).end();
    });
});

/**
 * イベント1件を処理する
 * 
 * @param {*} 
 * @return {Promise} 
 */

// replyMessage
// replyTokenは一定の期間が経過すると無効になるのでreplymessageは直後に送る用に使う
function replyTextMessage(event: any, text: string, quickreply?:any){
  var echoMessage = {
    type: 'text',
    text: text
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  console.log(echoMessage);
  return client.replyMessage(event.replyToken, echoMessage);
}

//jpgしか送れないです
function replyImageMessage(event: any, originalContentUrl: string, previewImageUrl: string, quickreply?:any){
  var echoMessage = {
    type: "image",
    originalContentUrl: originalContentUrl,
    previewImageUrl: previewImageUrl
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.replyMessage(event.replyToken, echoMessage);
};

function replyVideoMessage(event: any, originalContentUrl: string, previewImageUrl: string, quickreply?:any){
  var echoMessage = {
    type: "video",
    originalContentUrl: originalContentUrl,
    previewImageUrl: previewImageUrl
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.replyMessage(event.replyToken, echoMessage);
};

function replyAudioMessage(event: any, originalContentUrl: string, duration: number, quickreply?:any){
  var echoMessage = {
    type: "audio",
    originalContentUrl: originalContentUrl,
    duration: duration
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.replyMessage(event.replyToken, echoMessage);
};

function replyLocationMessage(event: any, title: string, address: string, latitude: number, longitude: number, quickreply?:any){
  var echoMessage = {
    type: "location",
    title: title,
    address: address,
    latitude: latitude,
    longitude: longitude
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.replyMessage(event.replyToken, echoMessage);
};

// idについてはhttps://developers.line.biz/media/messaging-api/sticker_list.pdfを参照
function replyStickerMessage(event: any, packageId: number, stickerId: number, quickreply?:any){
  var echoMessage = {
    type: "sticker",
    packageId: packageId,
    stickerId: stickerId
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.replyMessage(event.replyToken, echoMessage);
};

// dateの例'20191231'
//当日分は返せない
function getNumberOfSentReplyMessages(date: string){
  return client.getNumberOfSentReplyMessages(date).then((res) => {
    console.log(res);
  })
}


// pushMessage
//任意のタイミングでメッセージが遅れるやつ
function pushTextMessage(user_or_group_or_room_id : string, text :string, quickreply?:any){
  var echoMessage = {
    type: 'text',
    text: text
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.pushMessage(user_or_group_or_room_id,echoMessage);
}

//jpgしか送れないです
function pushImageMessage(user_or_group_or_room_id : string, originalContentUrl: string, previewImageUrl: string, quickreply?:any){
  var echoMessage = {
    type: "image",
    originalContentUrl: originalContentUrl,
    previewImageUrl: previewImageUrl
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.pushMessage(user_or_group_or_room_id,echoMessage);
}

function pushVideoMessage(user_or_group_or_room_id : string, originalContentUrl: string, previewImageUrl: string, quickreply?:any){
  var echoMessage = {
    type: "video",
    originalContentUrl: originalContentUrl,
    previewImageUrl: previewImageUrl
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.pushMessage(user_or_group_or_room_id,echoMessage);
}

function pushAudioMessage(user_or_group_or_room_id : string, originalContentUrl: string, duration: number, quickreply?:any){
  var echoMessage = {
    type: "audio",
    originalContentUrl: originalContentUrl,
    duration: duration
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.pushMessage(user_or_group_or_room_id,echoMessage);
}

function pushLocationMessage(user_or_group_or_room_id: string, title: string, address: string, latitude: number, longitude: number, quickreply?:any){
  var echoMessage = {
    type: "location",
    title: title,
    address: address,
    latitude: latitude,
    longitude: longitude
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.pushMessage(user_or_group_or_room_id, echoMessage);
};

// idについてはhttps://developers.line.biz/media/messaging-api/sticker_list.pdfを参照
function pushStickerMessage(user_or_group_or_room_id: string, packageId: number, stickerId: number, quickreply?:any){
  var echoMessage = {
    type: "sticker",
    packageId: packageId,
    stickerId: stickerId
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.pushMessage(user_or_group_or_room_id, echoMessage);
};

// dateの例'20191231'
//当日分は返せない
function getNumberOfSentPushMessages(date: string){
  return client.getNumberOfSentPushMessages(date).then((res) => {
    console.log(res);
  })
}


// multicastMessage
//任意のタイミングでメッセージが遅れるやつ(to 複数人)
function multicastTextMessage(user_id_array: string[], text: string, quickreply?:any){
  var echoMessage = {
    type: 'text',
    text: text
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.multicast(user_id_array,echoMessage);
}

//jpgしか送れないです
function multicastImageMessage(user_id_array: string[], originalContentUrl: string, previewImageUrl: string, quickreply?:any){
  var echoMessage = {
    type: "image",
    originalContentUrl: originalContentUrl,
    previewImageUrl: previewImageUrl
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.multicast(user_id_array,echoMessage);
}

function multicastVideoMessage(user_id_array: string[], originalContentUrl: string, previewImageUrl: string, quickreply?:any){
  var echoMessage = {
    type: "video",
    originalContentUrl: originalContentUrl,
    previewImageUrl: previewImageUrl
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.multicast(user_id_array,echoMessage);
}

function multicastAudioMessage(user_id_array: string[], originalContentUrl: string, duration: number, quickreply?:any){
  var echoMessage = {
    type: "audio",
    originalContentUrl: originalContentUrl,
    duration: duration
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.multicast(user_id_array,echoMessage);
}

function multicastLocationMessage(user_id_array: string[], title: string, address: string, latitude: number, longitude: number, quickreply?:any){
  var echoMessage = {
    type: "location",
    title: title,
    address: address,
    latitude: latitude,
    longitude: longitude
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.multicast(user_id_array, echoMessage);
};

// idについてはhttps://developers.line.biz/media/messaging-api/sticker_list.pdfを参照
function multicastStickerMessage(user_id_array: string[], packageId: number, stickerId: number, quickreply?:any){
  var echoMessage = {
    type: "sticker",
    packageId: packageId,
    stickerId: stickerId
  };
  if(quickreply) {
    echoMessage["quickReply"] = quickreply;
  }
  return client.multicast(user_id_array, echoMessage);
};

// dateの例'20191231'
//当日分は返せない
function getNumberOfSentMulticastMessages(date: string){
  return client.getNumberOfSentMulticastMessages(date).then((res) => {
    console.log(res);
  })
}



// image, video, and audioのデータが返ってくる
function getMessageContent(message_id: string){
  return client.getMessageContent(message_id).then((stream) => {
    stream.on('data', (chunk) => {
      console.log(chunk);
    });
    stream.on('error', (err) => {
      console.log(err);
    });
  });
}

//userIdとサムネと名前を返す
function getProfile(user_id: string){
  return client.getProfile(user_id).then((profile) => {
    console.log(profile);
  });
}



// Group
//userIdとサムネと名前を返す
function getGroupMemberProfile(group_id: string, user_id: string){
  return client.getGroupMemberProfile(group_id, user_id).then((profile) => {
    console.log(profile);
  })
}

function getGroupMemberIds(group_id: string){
  client.getGroupMemberIds(group_id).then((ids) => {
    ids.forEach((id) => console.log(id));
  })
}

function leaveGroup(group_id: string){
  client.leaveGroup(group_id)
}

//Room(複数人トーク)
//userIdとサムネと名前を返す
function getRoomMemberProfile(room_id: string, user_id: string){
  return client.getRoomMemberProfile(room_id, user_id).then((profile) => {
    console.log(profile);
  })
}

function getRoomMemberIds(room_id: string){
  client.getRoomMemberIds(room_id).then((ids) => {
    ids.forEach((id) => console.log(id));
  })
}

function leaveRoom(room_id: string){
  client.leaveRoom(room_id)
}


//リッチメニュー
function createRichMenu(rich_menu) {
  client.createRichMenu(rich_menu).then(id => console.log(id));
}

function getRichMenu(rich_menu_id: string) {
  client.getRichMenu(rich_menu_id).then(res => console.log(res));
}

function deleteRichMenu(rich_menu_id: string) {
  client.deleteRichMenu(rich_menu_id);
}

function getRichMenuIdOfUser(user_id: string) {
  client.getRichMenuIdOfUser(user_id).then(rich_menu_id => console.log(rich_menu_id));
}

function linkRichMenuToUser(user_id: string, rich_menu_id: string) {
  client.linkRichMenuToUser(user_id, rich_menu_id);
}

function unlinkRichMenuFromUser(user_id: string) {
  client.unlinkRichMenuFromUser(user_id);
}

//画像フォーマット：JPEGまたはPNG,画像サイズ：2500×1686または2500×843ピクセル
function setRichMenuImage(
    rich_menu_id: string,
    path: string,
    content_type?: string) {
  const data = getImg(path);
  console.log(data);
  return client.setRichMenuImage(rich_menu_id, data, content_type);
}

function getRichMenuList() {
  client.getRichMenuList().then(richmenus => console.log(richmenus));
}

function setDefaultRichMenu(rich_menu_id: string) {
  client.setDefaultRichMenu(rich_menu_id);
}




//urlの画像をbuffer化
function getImg(path) {
  var fs = require('fs');
  return fs.readFile( path, function( err, content ) {
    if( err ) {
      console.error(err);
    }
    else {
      return content;
    }
  });
}

// サーバを起動する
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});