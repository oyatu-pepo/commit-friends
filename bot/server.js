"use strict";

const express = require("express");
const line = require("@line/bot-sdk");
const PORT = process.env.PORT || 3000;

const config = {
  channelSecret: "b85afa07249f830b9de32aa6393493b4",
  channelAccessToken:
    "6U8cMeuT3Ek0hX8y/HFcibjqWdyByxrp0Plp1h1y+J0L9TMqtX2kDWdrwxi0JRnGl9GIOzBoC1rfzF9TXs8KMkOUobl4pkmMF1SPkJF4/4taBIbSN/oSj7vPE2O5WB53NgxU1+KuPGzaGDc18qBCkAdB04t89/1O/w1cDnyilFU="
};

const app = express();

app.post("/webhook", line.middleware(config), (req, res) => {
  console.log(req.body.events);
  Promise.all(req.body.events.map(handleEvent)).then(result =>
    res.json(result)
  );
});

const client = new line.Client(config);
const redisClient = require('redis').createClient(process.env.REDIS_URL);

function handleEvent(event) {
  console.log("[Event type]: " + event.type);
  let replyText = "hogehoge";

  if (event.type == "unfollow") {
    replyText = "またのご利用お待ちしています！";
  }

  if (event.type == "follow") {
    // 招待された時
    replyText = "招待ありがとうございます！";
  }

  if (event.message.text === "こんにちは") {
    replyText = "こんばんわの時間ですよ";
  }

  return replyMessage(event, replyText);
}

function replyMessage(event, message) {
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: message
  });
}

// 目標設定
app.get("/goal", (req, res) => {
  const expire = req.query.expire;
  const content = req.query.content;
  const key = `goal-${req.query.userId}`;

  console.log(key, content);
  redisClient.lpush(key, content, () => {
    console.log('callback1');
    console.log(key, expire);
    redisClient.lpush(key, expire, () => {
      console.log('callback2');
      res.sendStatus(200);
    });
  });
});

app.listen(PORT);
console.log(`Server running at ${PORT}`);
