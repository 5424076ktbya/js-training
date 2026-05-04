import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart07";
import instruction from "./instruction.md?raw";

const convertData = (input) => {
  for (const item of input) {
    const d = new Date(`${item.createdAt} UTC`); //日付を日本時間に直す
    const year = d.getFullYear(); //年月日を取り出す
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const date = `${d.getDate()}`.padStart(2, "0");
    item.createdAt = `${year}-${month}-${date}`; //"2020-01-26" みたいな形になる
  }
  const dates = Array.from(new Set(input.map(({ createdAt }) => createdAt))); //日付一覧を作る
  dates.sort(); //並び替え
  const count = { tweet: {}, retweet: {} }; //カウント用の箱を作る
  for (const d of dates) { //日付ごとに0を入れる
    count.tweet[d] = 0;
    count.retweet[d] = 0;
  }
  for (const { createdAt, isRetweet } of input) { //件数を数える
    if (isRetweet) {
      count.retweet[createdAt] += 1;
    } else {
      count.tweet[createdAt] += 1;
    }
  }
  return ["tweet", "retweet"].map((key) => { //最終形式に変換
    return {
      id: key,
      data: dates.map((d) => {
        return {
          x: d,
          y: count[key][d],
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
