require('dotenv').config();
const line = require('@line/bot-sdk');
const express = require('express');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);
const app = express();

app.post('/callback', line.middleware(config), (req, res) => {
  const events = req.body.events;
  Promise.all(events.map((event) => {
    if(event.type === 'message') {
      getMessageContent(event.message.id);
      getProfile(event.source.userId);
      console.log(event);
      return replyImageMessage(event,"https://ellachanblog.com/wp-content/uploads/2019/04/blue-blue-sky-clear-sky-2086535-1024x668.jpg" ,"https://ellachanblog.com/wp-content/uploads/2019/04/blue-blue-sky-clear-sky-2086535-1024x668.jpg").catch(() => { return null; });
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

function replyTextMessage(event: any, text: string){
  const echoMessage = {
    type: 'text',
    text: text
  };
  return client.replyMessage(event.replyToken, echoMessage);
}

function replyImageMessage(event: any, originalContentUrl: string, previewImageUrl: string){
  //jpgしか送れないです
  const echoMessage = {
    type: "image",
    originalContentUrl: originalContentUrl,
    previewImageUrl: previewImageUrl
  };
  return client.replyMessage(event.replyToken, echoMessage);
};

function multicastMessage(user_id_array: string[], text: string){
  const echoMessage = {
    type: 'text',
    text: text
  };
  return client.multicast(user_id_array,echoMessage);
}

function pushMessage(user_or_group_or_room_id : string, text :string){
  const echoMessage = {
    type: 'text',
    text: text
  };
  return client.pushMessage(user_or_group_or_room_id,echoMessage);
}

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

function getProfile(user_id: string){
  return client.getProfile(user_id).then((profile) => {
    console.log(profile);
  });
}

// サーバを起動する
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});