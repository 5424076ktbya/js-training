import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart09";
import instruction from "./instruction.md?raw";

const convertData = (input) => {
  const ratio = 0.01;
  const ministryCount = {};
  const ministries = Array.from(        //省ごとに分ける
    new Set(input.map(({ ministry }) => ministry))
  ).map((ministry) => {
    const ministryProjects = input.filter((item) => item.ministry === ministry); //その省だけ取り出す
    const bureauCount = {};
    const bureaus = Array.from(       //部局ごとに分ける
      new Set(ministryProjects.map(({ bureau }) => bureau))
    )
      .map((bureau) => {
        const bureauProjects = ministryProjects.filter(
          (item) => item.bureau === bureau
        );   //部局ごとのデータ
        const departments = Array.from(      //課ごとに分ける
          new Set(bureauProjects.map(({ department }) => department))
        )
          .map((department) => {
            const departmentProjects = bureauProjects.filter(
              (item) => item.department === department
            );
            return {   //課ごとの件数を数える
              name: department,
              count: departmentProjects.length,
            };
          })
          .filter(({ count }) => count / input.length >= ratio);  //少ないやつを消す
        departments.sort((item1, item2) => item2.count - item1.count);
        departments.push({   //その他を作る
          name: "その他",
          count:
            bureauProjects.length -
            departments.reduce((a, { count }) => a + count, 0),
        });
        bureauCount[bureau] = bureauProjects.length;
        return {
          name: bureau,
          children: departments,
        };
      })
      .filter(({ name }) => bureauCount[name] / input.length >= ratio);
    bureaus.sort(
      (item1, item2) => bureauCount[item2.name] - bureauCount[item1.name]
    );
    bureaus.push({
      name: "その他",
      count:
        ministryProjects.length -
        bureaus.reduce((a, { name }) => a + bureauCount[name], 0),
    });
    ministryCount[ministry] = ministryProjects.length;
    return {
      name: ministry,
      children: bureaus,
    };
  });
  ministries.sort(
    (item1, item2) => ministryCount[item2.name] - ministryCount[item1.name]
  );
  return {
    children: ministries,
  };
};

const Lesson = () => {
  return (
    <LessonPage
      answerUrl="/answer09"
      convertData={convertData}
      dataUrl="data/judgit-departments.json"
      instruction={instruction}
      title="Lesson 09"
      Chart={Chart}
    />
  );
};

export default Lesson;
