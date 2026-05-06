import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart04";
import instruction from "./instruction.md?raw";

const convertData = (input) => {
  const species = Array.from(new Set(input.map(({species}) => species)));  //input.map(({ species }) => species)は各データから 品種名だけ取り出す、new Set(...)は重複を消す、Array.from(...)はSetは配列じゃないので、配列に戻す
  return species.map((species) => {  //品種ごとに処理する
    return {
      id: species,  //出力形式の id に品種名を入れる
      data: input
        .filter((item) => item.species === species)  //今の品種だけ抽出する
        .map(({ sepalLength: x, petalWidth: y }) => ({ x, y })),  //データの形を変換する
    };
  });
};

const Lesson = () => {
  return (
    <LessonPage
      answerUrl="/answer04"
      dataUrl="data/iris.json"
      convertData={convertData}
      instruction={instruction}
      title="Lesson 04"
      Chart={Chart}
    />
  );
};

export default Lesson;
