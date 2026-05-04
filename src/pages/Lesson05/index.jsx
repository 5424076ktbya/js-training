import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart05";
import instruction from "./instruction.md?raw";

const convertData = (input) => {
  const genders = Array.from(new Set(input.map(({ gender }) => gender))); //性別一覧を作る
  const min = Math.round(Math.min(...input.map(({ y }) => y))); //最小値
  const max = Math.round(Math.max(...input.map(({ y }) => y))); //最大値
  const bins = Array.from({ length: max - min + 1 }).map((_, i) => { //空のビン（箱）を作る
    const obj = { //ビン1個の中身
      bin: (min + i).toString(),
    };
    for (const gender of genders) { //男女のカウントを0で初期化
      obj[gender] = 0;
    }
    return obj;
  });
  for (const { y, gender } of input) { //データを1人ずつ入れる
    const i = Math.round(y) - min; //どの箱に入れるか計算
    bins[i][gender] += 1; //カウントを増やす
  }
  return bins;
};
const Lesson = () => {
  return (
    <LessonPage
      answerUrl="/answer05"
      convertData={convertData}
      dataUrl="data/size-and-weight.json"
      instruction={instruction}
      title="Lesson 05"
      Chart={Chart}
    />
  );
};

export default Lesson;
