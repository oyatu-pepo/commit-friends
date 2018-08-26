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

app.listen(PORT);
console.log(`Server running at ${PORT}`);
