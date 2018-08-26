"use strict";

const express = require("express");
const line = require("@line/bot-sdk");
const PORT = process.env.PORT || 3000;
var Script = require("./const.js");

const config = {
  channelSecret: "ed1dd9415344ff396ba73dc0d0123e73",
  channelAccessToken:
    "aOuRKU4/TJlEkNKgT79AKLrTwzkXGUVWhtjDUALEGwPUGNztcuoa/5AB8pAQNrcMn7ZeLtSQDYKGsDLV3TiD5+4bb/fNW61xPX599q5pUhFdoWBmro/fmVcyTYGoNSRqPiv9l08ilOjNrJ2xDsn8hAdB04t89/1O/w1cDnyilFU="
};

const app = express();

app.post("/webhook", line.middleware(config), (req, res) => {
  console.log(req.body.events);
  // console.log("==========");
  // console.log(req);
  // console.log("==========");
  Promise.all(req.body.events.map(handleEvent)).then(result =>
    res.json(result)
  );
});

app.get("/goal", (req, res) => {
  console.log(req.query);
  // console.log("==========");
  return res.json("");
});

const client = new line.Client(config);

function handleEvent(event) {
  console.log("[Event type]: " + event.type);
  let groupId;
  let userId = event.source.userId;
  console.log("userId: " + userId);

  if (event.source.groupId !== undefined) {
    groupId = event.source.groupId;
    console.log("groupId: " + groupId);
  }
  let replyText = "";

  if (event.type == "unfollow") {
    replyText = "またのご利用お待ちしています！";
  }

  if (event.type == "follow") {
    // 招待された時
    replyText = "招待ありがとうございます！ コミットフレンズだよ。";
  }

  // 目標設定
  if (event.message.text === "目標を教えて") {
    replyText = Script.REGISTER_GOAL_OK;
  }

  // 進捗確認
  if (event.message.text === "進捗教えて") {
    replyText = Script.PROGRESS_STATUS_RESULT_BAD;
  }

  // botに返答
  if (replyText === "") {
    // 返答文がなければ、スルー
    return Promise.resolve(null);
  } else {
    return replyMessage(event, replyText);
  }
}

function replyMessage(event, message) {
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: message
  });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);
