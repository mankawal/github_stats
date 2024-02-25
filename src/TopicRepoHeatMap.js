import { useEffect, useState } from "react";
import * as d3 from "d3";
import "./index.css";
import tooltip_styles from "./tooltip.module.css";

import {COLORS, THRESHOLDS} from "./constants";
import { forks_topics_repos_raw } from "./forks_topics_repos_data";

const margin = { top: 40, right: 100, bottom: 100, left: 20};
const MAX_RANK = 15;

/*
  const Tooltip = (({hoveredCell, w, h}) => {
  if (!hoveredCell) {
    return;
  }
  return (
    <div style={{w, h, position: "absolute",
          top: 0, left: 0, pointerEvents: "none"}}>
      <div clasName={tooltip_styles.tooltip}
        style={{position: "absolute",
          left: hoveredCell.xPos, top: hoveredCell.yPos }}>
        <TooltipRow label={"topic"} value={hoveredCell.xLabel} />
        <TooltipRow label={"repo"} value={hoveredCell.yLabel} />
        <TooltipRow label={"forks"} value={hoveredCell.value} />
      </div>
    </div>
  );
});
*/

/* TODO:
 * - Add HeatMap Color Legend
 */
export default function TopicRepoHeatMap({
  width, height, month_year, filterRepo, filterTopic
}) {
  const [data, setData] = useState(forks_topics_repos_raw);
  const [month, year] = month_year.split(":");
  console.log("month_year: ", month_year, month, year);
  useEffect(() => {
    const queryDb = () => {
      const API = 'http://127.0.0.1:3001/api/topic_repo_stats';
      fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'month': month,
          'year': year,
          'sort_by': 'forks',
          'max_topic_rank': MAX_RANK,
          'max_repo_rank': 50,
        }),
        mode: 'cors'
      })
        .then((resp) => {
          console.log("Db response: ", resp);
          return resp.json();
        })
        .then((res_data) => {
          console.log("topic-repo query res: ", JSON.stringify(res_data));
          setData(res_data);
        });
    };
    if ( ((month >= 1) && (month <= 12)) ||
          ((year >= 2023) && (year <= 2024)) ) {
      queryDb();
    }
  }, [month, year]);
  /* Move to parent */
  const [hoveredCell, setHoveredCell] = useState(null);

  if (width < 10) return null;
  const max_x = width - margin.right - margin.left;
  const max_y = height - margin.top - margin.bottom;

  // console.log("type of forks_topics_repos_raw: ", typeof(forks_topics_repos_raw));

  let topics = new Map(); 
  const repos = new Map(data.map((e) => [e.repo_name, {
    metric_count: 0, lang: "undef", rank: 0, pct: 0,
    overall_rank: Number(e.overall_repo_rank),
  }]));
  let max_repo_pct = 0;
  let min_repo_pct = 100;
  for (const stat of data) {
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
      lang: (((stat.lang !== null) && (stat.lang !== "")) ?
        stat.lang : "undef"),
    });
    if (max_repo_pct < stat.pct_repo_to_topic) {
      max_repo_pct = stat.pct_repo_to_topic;
    }
    if (min_repo_pct > stat.pct_repo_to_topic) {
      min_repo_pct = stat.pct_repo_to_topic;
    }
  }
  const topics_keys = Array.from(topics, ([k, v]) => k);
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
    .domain(THRESHOLDS.map(
      (t) => t * (max_repo_pct - min_repo_pct)))
    .range(COLORS);

  const rects = [];
  let labels_x = [];
  let labels_y = [];
  let first_pass_repos_done = false;
  let filtered = null;
  if ( ((filterTopic !== undefined) && (filterTopic !== null)) ||
    ((filterRepo !== undefined) && (filterRepo !== null)) ) {
    filtered = false;
  }
  /*
    console.log("filtered: ", filtered, "topic: ", 
    ((filterTopic !== undefined) && (filterTopic !== null)),
    "repo: ", ((filterRepo !== undefined) && (filterRepo !== null)));
    */

  for (const t of topics) {
    const pos_x = scale_x(t[0]);
    for (const r of repos_keys_by_rank) {
      const topic_repo = t[1].repos.get(r)
      if (filtered === false) {
        filtered = ((filterTopic === t[0]) || (filterRepo === r));
      }
      let filter_opacity = ( ((filtered === undefined) || (filtered === null))
        ? 1
        : (filtered ? 1 : 0.2));
      /*
        console.log(t[0], r, "filter: ", filtered, filterTopic,
        filterRepo, "opacity: ", filter_opacity);
        */
      const pos_y = scale_y(r);
      if (!first_pass_repos_done) {
        labels_y.push(
          <text
            key = {r}
            x = {max_x}
            y = {pos_y}
            textAnchor = "start"
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
          opacity={filter_opacity}
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
      if (filtered === true) { filtered = false; }
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
        stroke = "bold"
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
