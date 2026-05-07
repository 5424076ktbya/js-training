import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart08";
import instruction from "./instruction.md?raw";

const convertData = (input) => {  //タグをソート、各記事のタグ配列をアルファベット順に並べ替え、同じ組み合わせとして扱える
  for (const item of input) {
    item.tags.sort();
  }

  const tagSet = new Set(); //タグ一覧を作る、全記事からタグを全部集めて「重複を除いた一覧」を作っている。
  for (const item of input) {
    for (const tag of item.tags) {
      tagSet.add(tag);
    }
  }
  const tags = Array.from(tagSet);

  const count = {}; //共起回数を入れる箱を作る、タグ同士の組み合わせの回数を記録する「表」を作っている
  for (const tag1 of tags) {
    count[tag1] = {};
    for (const tag2 of tags) {
      count[tag1][tag2] = 0;  //count["Python"]["Ruby"] のようにアクセスできる
    }
  }

  for (const item of input) { //共起回数を数える,1つの記事の中で「タグのペア」を全部取り出してカウント
    const n = item.tags.length;
    for (let j = 0; j < n; ++j) {
      for (let i = 0; i < j; ++i) {  //なぜ i < j にしているのか？重複なしで全部のペアが取れる
        count[item.tags[i]][item.tags[j]] += 1;  //この2つのタグが同じ記事にあった回数を +1
      }
    }
  }

  const links = []; //共起回数が2以上のものだけ links にする
  for (const tag1 of tags) {
    for (const tag2 of tags) {
      if (count[tag1][tag2] >= 2) {  //回数が2回以上のペアだけリンクとして追加
        links.push({
          source: tag1,
          target: tag2,
        });
      }
    }
  }

  const nodeSet = new Set();  //nodes を作る,リンクに登場したタグだけを集める
  for (const { source, target } of links) {
    nodeSet.add(source);
    nodeSet.add(target);
  }

  const nodes = Array.from(nodeSet).map((tag) => {  //タグを { id: "タグ名" } の形式に変換
    return {
      id: tag,
    };
  });

  return {  //最終結果を返す
    nodes,
    links,
  };
};

const Lesson = () => {
  return (
    <LessonPage
      answerUrl="/answer08"
      convertData={convertData}
      dataUrl="data/qiita-articles.json"
      instruction={instruction}
      title="Lesson 08"
      Chart={Chart}
    />
  );
};

export default Lesson;
