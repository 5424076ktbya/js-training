import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart10";
import instruction from "./instruction.md?raw";

const convertData = (input) => {
  const degree = {};
  for (const { id } of input.nodes) {
    degree[id] = 0;
  }
  for (const { source, target } of input.links) {  //リンクを見て増やす
    degree[source] += 1;
    degree[target] += 1;
  }

  const removedTags = new Set(  //削除対象
    input.nodes.map(({ id }) => id).filter((tag) => degree[tag] <= 1)
  );
  const nodes = input.nodes.filter(({ id }) => !removedTags.has(id));  //実際に消す
  const links = input.links.filter(
    ({ source, target }) => !removedTags.has(source) && !removedTags.has(target)
  );

  const neighbors = {};  //隣接リストを作る
  for (const { id } of nodes) {
    neighbors[id] = [];
  }
  for (const { source, target } of links) {  //リンクを入れる
    neighbors[source].push(target);
  }

  const visited = new Set();  //幅優先探索（BFS）
  const queue = ["福島"];
  while (queue.length > 0) {  //ループ
    const u = queue.shift();
    if (visited.has(u)) {
      continue;  //まだ見てなければ
    }
    visited.add(u);
    for (const v of neighbors[u]) {
      queue.push(v);  //次に進む
    }
  }

  const maxFrequency = Math.max(
    ...input.nodes.map(({ frequency }) => frequency)
  );  //半径（大きさ）
  for (const node of nodes) {
    node.radius = Math.sqrt(node.frequency / maxFrequency) * 20;  //半径計算
    node.color = visited.has(node.id) ? "red" : "blue"; //色
  }

  return { nodes, links };
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
