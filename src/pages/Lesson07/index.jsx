import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart07";
import instruction from "./instruction.md?raw";

const convertData = (input) => {
  for (const item of input) {
    const d = new Date(`${item.createdAt} UTC`); //日付を日本時間に直す
    const year = d.getFullYear(); //年を取得
    const month = `${d.getMonth() + 1}`.padStart(2, "0");//月を取得（※0始まりなので +1）
    const date = `${d.getDate()}`.padStart(2, "0");//日を取得,文字列.padStart(最終的な長さ, 埋める文字),足りない分を左に "0" で埋める
    item.createdAt = `${year}-${month}-${date}`; //"2020-01-26" みたいな形になる、「時刻」は消えて「日付だけ」
  }
  const dates = Array.from(new Set(input.map(({ createdAt }) => createdAt))); //日付一覧を作る
  dates.sort(); //並び替え(昇順)
  const count = { tweet: {}, retweet: {} }; //カウント用の箱を作る
  for (const d of dates) { //すべての日付を0で初期化
    count.tweet[d] = 0;
    count.retweet[d] = 0;
  }
  for (const { createdAt, isRetweet } of input) { //各データから日付、リツイートかどうかを取り出す
    if (isRetweet) {
      count.retweet[createdAt] += 1;
    } else {
      count.tweet[createdAt] += 1;
    }
  }
  return ["tweet", "retweet"].map((key) => { //最終形式に変換、グラフ用データに変換
    return {
      id: key,
      data: dates.map((d) => {  //日付ごとにデータ作成
        return {
          x: d,  //日付
          y: count[key][d], //件数
        };
      }),
    };
  });
};

const Lesson = () => {
  return (
    <LessonPage
      answerUrl="/answer07"
      convertData={convertData}
      dataUrl="data/covid19-tweets.json"
      instruction={instruction}
      title="Lesson 07"
      Chart={Chart}
    />
  );
};

export default Lesson;
