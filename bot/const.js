module.exports = Object.freeze({
  // てきとー
  PROGRESS_STATUS_RESULT_BAD: "進捗だめです!",

  // 目標登録
  REGISTER_GOAL_OK: "目標を登録しました!",

  // 進捗報告
  ASK_PROGRESSS_STATUS: "今日は頑張れましたか? 教えてください。",
  PROGRESS_STATUS_GOOD:
    "さすがです！本当に素晴らしいですね。明日もこの調子でがんばっていきましょう。",
  PROGRESS_STATUS_NOT_GOOD:
    "あともう一歩ですね。明日もがんばりましょう。応援しています。",
  PROGRESS_STATUS_BAD:
    "そうだったんですね。そういう日もありますね。また明日がんばりましょう",

  // 目標最終確認
  FINAL_CHECK_GOAL: "目標設定日になりました。目標は達成できましたか?",
  FINAL_CHECK_YES: "達成おめでとうございます！！",
  FINAL_CHECK_NO: "次ならダイジョブですよ",

  CHECK_FLEX: {
    type: "flex",
    altText: "hoge",
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url:
          "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
        action: {
          type: "uri",
          uri: "http://linecorp.com/"
        }
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "目標は達成できましたか？",
            weight: "bold",
            size: "sm"
          },
          {
            type: "button",
            style: "primary",
            action: {
              type: "message",
              label: "はい",
              text: "達成おめでとうございます"
            }
          },
          {
            type: "button",
            style: "secondary",
            action: {
              type: "message",
              label: "いいえ",
              text: "次なら大丈夫ですよ"
            }
          }
        ]
      }
    }
  }
});
