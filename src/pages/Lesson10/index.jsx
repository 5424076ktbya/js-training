import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart10";
import instruction from "./instruction.md?raw";

const convertData = (input) => {
  const degree = {};  //degree という空のオブジェクトを作成
  for (const { id } of input.nodes) {  //各ノードの次数を保存
    degree[id] = 0;  //最初は全ノードの次数を 0 に初期化
  }
  for (const { source, target } of input.links) {  //links を 1 本ずつ見ていく
    degree[source] += 1;
    degree[target] += 1;
  }

  const removedTags = new Set(  //削除対象
    input.nodes.map(({ id }) => id).filter((tag) => degree[tag] <= 1)  //次数1以下のノードを探す,次数が 1 以下のノードだけ残す
  );
  const nodes = input.nodes.filter(({ id }) => !removedTags.has(id));  //実際に消す,削除対象に含まれていないノードだけ残す
  const links = input.links.filter(  //リンクも必要なものだけ残す
    ({ source, target }) => !removedTags.has(source) && !removedTags.has(target)
  );

  const neighbors = {};  //隣接リストを作る、隣接リストを保存するオブジェクト
  for (const { id } of nodes) {  //残ったノードを順番に見る
    neighbors[id] = [];  //各ノードに空配列を作る
  }
  for (const { source, target } of links) {  //隣接ノードを追加,残ったリンクを見る
    neighbors[source].push(target);  //source から行けるノードとして target を追加
  }

  const visited = new Set();  //幅優先探索（BFS）,訪れたノードを記録
  const queue = ["福島"];  //探索開始地点は福島,queue は待ち行列
  while (queue.length > 0) {  //queue が空になるまで繰り返す
    const u = queue.shift();  //queue の先頭を取り出す
    if (visited.has(u)) {  //すでに訪問済みか確認
      continue;  //訪問済みなら次へ
    }
    visited.add(u);  //訪問済みに追加
    for (const v of neighbors[u]) {  //u から行けるノードを全部調べる
      queue.push(v);  //次に探索するため queue に追加
    }
  }

  const maxFrequency = Math.max(  //一番大きい frequency を求める
    ...input.nodes.map(({ frequency }) => frequency)  //frequency だけ取り出す
  );  
  for (const node of nodes) {  //ノードを1つずつ処理
    node.radius = Math.sqrt(node.frequency / maxFrequency) * 20;  //半径を計算
    node.color = visited.has(node.id) ? "red" : "blue"; //三項演算子,条件 ? trueの時 : falseの時
  }

  return { nodes, links };  //変換後のデータを返す
};

const Lesson = () => {
  return (
    <LessonPage
      answerUrl="/answer10"
      convertData={convertData}
      dataUrl="data/topic-graph.json"
      instruction={instruction}
      title="Lesson 10"
      Chart={Chart}
    />
  );
};

export default Lesson;
