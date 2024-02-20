import { React, useState } from "react";
import * as d3 from "d3";
import "./index.css";

import {COLORS, THRESHOLDS} from "./constants";
import { forks_topics_repos_raw } from "./forks_topics_repos_data";

const purple1 = "#6c5efb";
const purple2 = "#c998ff";
const purple3 = "#a44afe";
const background = "#eaedff";
const defaultMargin = { top: 40, right: 10, bottom: 100, left: 100};

const data_raw = forks_topics_repos_raw;

export default function TopicRepoHeatMap({
  width,
  height,
  event = false,
  margin = defaultMargin
}) {

  /* Move to parent */
  const [hoveredCell, setHoveredCell] = useState(null);

  if (width < 10) return null;

  const max_x = width - margin.right - margin.left;
  const max_y = height - margin.top - margin.bottom;

  // console.log("type of forks_topics_repos_raw: ", typeof(forks_topics_repos_raw));

  let topics = new Map(); 
  const repos = new Map(data_raw.map((e) => [e.repo_name, {
    metric_count: 0, lang: "undef", rank: 0, pct: 0,
    overall_rank: Number(e.overall_repo_rank),
  }]));
  let max_repo_pct = 0;
  for (const stat of data_raw) {
    if (!topics.has(stat.topic)) {
      topics.set(stat.topic, {
        topic: stat.topic,
        total_metric_count: Number(stat.total_metric_count),
        rank: Number(stat.topic_rank),
        repos: new Map(),
      });
    }
    topics.get(stat.topic).repos.set(stat.repo_name, {
      pct: Number(stat.pct_repo_to_topic),
      metric_count: Number(stat.repo_metric_count),
      rank: Number(stat.repo_rank),
      lang: (((stat.lang !== null) && (stat.lang != "")) ?
        stat.lang : "undef"),
    });
    if (max_repo_pct < stat.pct_repo_to_topic) {
      max_repo_pct = stat.pct_repo_to_topic;
    }
  }
  const topics_keys = Array.from(topics, ([k, v]) => k);
  const repos_keys = Array.from(repos, ([k, v]) => k);
  const repos_keys_by_rank = [...repos].sort((l, r) =>
    ((l[1].overall_rank > r[1].overall_rank)
      ? 1 : ((l[1].overall_rank < r[1].overall_rank) ? -1: 0))
  ).map((e) => e[0]);

  const scale_x = d3.scaleBand()
    .range([0, max_x])
    .domain(topics_keys)
    .padding(0.1);
  const scale_y = d3.scaleBand()
    .range([0, max_y])
    .domain(repos_keys_by_rank)
    .padding(0.1);

  const colorScale = d3.scaleLinear()
    .domain(THRESHOLDS.map((t) => t * max_repo_pct))
    .range(COLORS);

  const rects = [];
  let labels_x = [];
  let labels_y = [];
  let first_pass_repos_done = false;
  for (const t of topics) {
    const pos_x = scale_x(t[0]);
    for (const r of repos_keys_by_rank) {
      const topic = t[0];
      const topic_stats = t[1];
      const topic_repo = t[1].repos.get(r)
      // console.log(t[0], r, t[1].repos, "key: ", t[0] + "@" + r);
      const pos_y = scale_y(r);
      if (!first_pass_repos_done) {
        labels_y.push(
          <text
            key = {r}
            x = {-5}
            y = {pos_y}
            textAnchor = "end"
            dominantBaseline = "middle"
            fontSize = {8}
            stroke = "none"
            fill = "black"
          >
            {r}
          </text>
        );
      }
      rects.push(
        <rect
          key={t[0] + "@" + r}
          x={pos_x}
          y={pos_y}
          /* className={styles.rectangle} */
          width={scale_x.bandwidth()}
          height={scale_y.bandwidth()}
          fill={topic_repo ? colorScale(topic_repo.pct) : "#FCFCFC"} 
          onMouseEnter={(e) => {
            setHoveredCell({
              xLabel: String(t[0]),
              yLabel: r,
              xPos: pos_x + scale_x.bandwidth() + margin.left,
              yPos: pos_y + scale_y.bandwidth() / 2 + margin.top,
              value: (topic_repo !== undefined) ? topic_repo.pct : null,
            });
          }}
        />
      );
    }
    const l_x = pos_x;
    const l_y = max_y + 40;
    labels_x.push(
      <text
        key = {t[0]}
        x = {l_x}
        y = {l_y}
        textAnchor = "middle"
        dominantBaseline = "middle"
        fontSize = {10}
        stroke = "none"
        fill = "black"
        transform = {`rotate(-60, ${l_x},${l_y})`}
      >
        {t[0]}
      </text>
    );
    first_pass_repos_done = true;
  }

  // console.log(labels_x);
  return(
    <svg width={width} height={height} 
        onMouseLeave={() => setHoveredCell(null)}>
      <g width={max_x} height={max_y} fill='#FFFFFF'
        transform={`translate(${[margin.left, margin.top].join(",")})`}>
        {rects}
        {labels_x}
        {labels_y}
      </g>
    </svg>
  );
}
