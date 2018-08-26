"use strict";

const express = require("express");
const line = require("@line/bot-sdk");
const PORT = process.env.PORT || 3000;
var Script = require("./const.js");
var moment = require("moment-timezone");

const config = {
  channelSecret: "ed1dd9415344ff396ba73dc0d0123e73",
  channelAccessToken:
    "aOuRKU4/TJlEkNKgT79AKLrTwzkXGUVWhtjDUALEGwPUGNztcuoa/5AB8pAQNrcMn7ZeLtSQDYKGsDLV3TiD5+4bb/fNW61xPX599q5pUhFdoWBmro/fmVcyTYGoNSRqPiv9l08ilOjNrJ2xDsn8hAdB04t89/1O/w1cDnyilFU="
};

const app = express();
const redisClient = require("redis").createClient(process.env.REDIS_URL);

app.post("/webhook", line.middleware(config), (req, res) => {
  console.log(req.body.events);
  // console.log("==========");
  // console.log(req);
  // console.log("==========");
  Promise.all(req.body.events.map(handleEvent)).then(result =>
    res.json(result)
  );
});

app.get("/goal", async (req, res) => {
  console.log(req.query);
  const period = req.query.period;
  const content = req.query.content;
  const userId = req.query.userId;

  const registDate = moment()
    .tz("Asia/Tokyo")
    .format("YYYYMMDD");
  console.log(period);
  console.log(content);
  console.log(userId);
  console.log(registDate);

  // db保存
  const key = `goal-${userId}`;
  await redisClient.lpush(key, content);
  await redisClient.lpush(key, registDate);
  await redisClient.lpush(key, period);
  res.sendStatus(200);
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

  // 進捗報告
  if (event.message.text === "進捗を報告する") {
    const key = `goal-${userId}`;

    redisClient.lrange(key, 0, -1, (err, res) => {
      if (err) {
        console.log("lrange failed");
        return;
      }
      const period = res[0];
      const registDate = res[1];
      const content = res[2];

      var diff = moment().diff(moment(registDate), "days");

      replyText = getReplyTextProgressReport(diff, period);
      console.log(replyText);
      return replyMessage(event, replyText);
    });
    return;
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

function getReplyTextProgressReport(diff, period) {
  if (diff < period) {
    // 経過日数を伝える
    return `目標設定から${diff}日が経過しました。今日は頑張れましたか?` + "";
  } else if (diff == period) {
    return "目標設定設定日になりました。目標は達成できましたか?" + "";
  } else if (diff > period) {
    return "目標設定設定日を過ぎています。目標は達成できましたか?" + "";
  }
  return "処理に失敗しました";
}
