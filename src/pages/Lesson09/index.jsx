import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart09";
import instruction from "./instruction.md?raw";

const convertData = (input) => {
  const ratio = 0.01;
  const ministryCount = {};  //省ごとの件数を保存するオブジェクトを作成
  const ministries = Array.from(        //省一覧を取得
    new Set(input.map(({ ministry }) => ministry))
  ).map((ministry) => {  //省ごとに処理する
    const ministryProjects = input.filter((item) => item.ministry === ministry); //その省の事業だけ取得
    const bureauCount = {};  //部局の件数保存用
    const bureaus = Array.from(       //部局一覧取得,さっきの ministry と同様、部局名を重複なしで取得
      new Set(ministryProjects.map(({ bureau }) => bureau))
    )
      .map((bureau) => {  //各部局を処理
        const bureauProjects = ministryProjects.filter(  //その部局の事業だけ取得
          (item) => item.bureau === bureau
        );   
        const departments = Array.from(      //課一覧を取得,課名を重複なしで取得
          new Set(bureauProjects.map(({ department }) => department))
        )
          .map((department) => {  //各課を処理,課ごとに処理
            const departmentProjects = bureauProjects.filter(  //その課の事業取得
              (item) => item.department === department
            );
            return {   //課データ作成
              name: department,
              count: departmentProjects.length,
            };
          })
          .filter(({ count }) => count / input.length >= ratio);  //1%未満を除外
        departments.sort((item1, item2) => item2.count - item1.count);  //件数順に並べ替え,降順ソート
        departments.push({   //その他を作る,配列の最後に追加
          name: "その他",
          count:  //その他の件数計算,(その部局の総件数-表示対象の課の件数合計)
            bureauProjects.length -
            departments.reduce((a, { count }) => a + count, 0),
        });
        bureauCount[bureau] = bureauProjects.length;  //部局件数保存
        return {  //部局データ返却,部局の中に課データを入れる
          name: bureau,
          children: departments,
        };
      })
      .filter(({ name }) => bureauCount[name] / input.length >= ratio);  //小さい部局除外,1%未満の部局を除外
    bureaus.sort(  //部局を降順ソート
      (item1, item2) => bureauCount[item2.name] - bureauCount[item1.name]
    );
    bureaus.push({  //部局の「その他」,小さい部局をまとめる
      name: "その他",
      count:  //その他件数,省全体から、表示済み部局を引く
        ministryProjects.length -
        bureaus.reduce((a, { name }) => a + bureauCount[name], 0), //reduce 合計
    });
    ministryCount[ministry] = ministryProjects.length;  //省件数保存,省ごとの総数保存
    return {  //省データ返却
      name: ministry,
      children: bureaus,
    };
  });
  ministries.sort(  //省を降順ソート,事業数が多い省順
    (item1, item2) => ministryCount[item2.name] - ministryCount[item1.name]
  );
  return {  //最終結果返却
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
