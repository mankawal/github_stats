import { useEffect, useState } from "react";
import * as d3 from "d3";
import "./index.css";
import tooltip_styles from "./tooltip.module.css";

import styles from "./trh.module.css";

import {COLORS, THRESHOLDS} from "./constants";

const margin = { top: 40, right: 5, bottom: 100, left: 0};
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

export default function HeatMapHorizontal(
  width, height, hm_width, data,
  xkeyname, ykeyname,
  totalmetricname, xmetricname,
  xRankName, xrankOverallName, yrankname,
  xToYPctMetricName,
  xkeyfilter, ykeyfilter 
) {

  console.log(
  width, height, hm_width, data,
  xkeyname, ykeyname,
  totalmetricname, xmetricname,
  xRankName, xrankOverallName, yrankname,
  xToYPctMetricName,
  ykeyfilter, xkeyfilter);

  const [hoveredCell, setHoveredCell] = useState(null);

  if (width < 10) return null;

  let dataMap = new Map(); 
  const xValsMap = new Map(data.map((e) => [e[xkeyname], {
    metric_count: 0, lang: "undef", pct: 0,
    rank: Number(e[xrankOverallName]),
  }]))
  let max_x_to_y_pct = 0;
  let min_x_to_y_pct = 100;
  for (const stat of data) {
    if (!dataMap.has(stat[ykeyname])) {
      dataMap.set(stat[ykeyname], {
        topic: stat[ykeyname],
        total_metric_count: Number(stat[totalmetricname]),
        rank: Number(stat[yrankname]),
        mapXVals: new Map(),
      });
    }
    // console.log(stat[ykeyname], " -> ", stat[xkeyname]);
    dataMap.get(stat[ykeyname]).mapXVals.set(stat[xkeyname], {
      pct: Number(stat[xToYPctMetricName]),
      metric_count: Number(stat[xmetricname]),
      rank: Number(stat[xrankOverallName]),
      lang: (((stat.lang !== null) && (stat.lang !== "")) ?
        stat.lang : "undef"),
    });
    if (max_x_to_y_pct < stat[xToYPctMetricName]) {
      max_x_to_y_pct = stat[xToYPctMetricName];
    }
    if (min_x_to_y_pct > stat[xToYPctMetricName]) {
      min_x_to_y_pct = stat[xToYPctMetricName];
    }
  }
  console.log("dataMap: ", dataMap);
  let yfilterSet = ((ykeyfilter !== undefined) && (ykeyfilter !== null));
  let xfilterSet = ((xkeyfilter !== undefined) && (xkeyfilter !== null));
  let filterSet = yfilterSet || xfilterSet;
  let ymap_to_use = dataMap;
  let xmap_to_use = xValsMap;
  if (filterSet) {
    ymap_to_use = new Map([...dataMap].filter((t) => {
      /*
        console.log(ykeyfilter, t, 
        ((ykeyfilter != undefined) && (ykeyfilter === t[0])),
        (xkeyfilter !== undefined), t[1], t[1].mapXVals);
        */

      return ( (yfilterSet && (ykeyfilter === t[0])) ||
        (xfilterSet && (t[1].mapXVals.has(xkeyfilter))) );
    } ));
    if (yfilterSet) {
      console.log("filter-topics: ", ykeyfilter, dataMap.get(ykeyfilter));
      xmap_to_use = dataMap.get(ykeyfilter).mapXVals;
    }
    if (xfilterSet) {
      // console.log("filter-repos: ", xmap_to_use);
      xmap_to_use = new Map([...xmap_to_use]
        .filter((r) => (xkeyfilter === r[0]))
      );
    }
  }
  console.log(yfilterSet, xfilterSet, "ymap_to_use: ", ymap_to_use, "\nxmap_to_use: ", xmap_to_use);
  const ykeys = Array.from(ymap_to_use, ([k, v]) => k);
  const xkeys_by_rank = [...xmap_to_use].sort((l, r) =>
    ((l[1].rank > r[1].rank) ? 1 : ((l[1].rank < r[1].rank) ? -1: 0))
  ).map((e) => e[0]);

  if (filterSet) hm_width = width;
  const max_x = hm_width - margin.right - margin.left;
  const max_y = height - margin.top - margin.bottom;

  const scale_x = d3.scaleBand()
    .range([0, max_x])
    .domain(xkeys_by_rank)
    .padding(0.5);
  const scale_y = d3.scaleBand()
    .range([0, max_y])
    .domain(ykeys)
    .padding(0.5);

  const colorScale = d3.scaleLinear()
    .domain(THRESHOLDS.map(
      (t) => t * (max_x_to_y_pct - min_x_to_y_pct)))
    .range(COLORS);

  const rects = [];
  let labels_x = [];
  let labels_y = [];
  let first_pass_repos_done = false;
  let filtered = !filterSet;
  /*
    if (filterSet) {
    filtered = false;
  }
  console.log("filtered: ", filtered, "topic: ", 
    ((ykeyfilter !== undefined) && (ykeyfilter !== null)),
    "repo: ", ((xkeyfilter !== undefined) && (xkeyfilter !== null)));
  */

  for (const t of ymap_to_use) {
    const pos_y = scale_y(t[0]);
    for (const r of xkeys_by_rank) {
      const topic_repo = t[1].mapXVals.get(r)
      let filter_opacity = 1;
      const pos_x = scale_x(r);
      if (!first_pass_repos_done) {
        const l_x = pos_x+5;
        const l_y = max_y ;
        labels_x.push(
          <text
            key = {"hm_lbl_x_" + r}
            x = {l_x}
            y = {l_y}
            textAnchor = "end"
            dominantBaseline = "end"
            fontSize = {8}
            stroke = "3px black"
            fill = "black"
        transform = {`rotate(-90, ${l_x},${l_y})`}
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
    const l_x = 0;
    const l_y = pos_y;
    labels_y.push(
      <text
        key = {"hm_lbl_y_" + t[0]}
        x = {l_x + 95}
        y = {l_y + 5}
        textAnchor = "end"
        dominantBaseline = "middle"
        fontSize = {10}
        stroke = "bold"
        fill = "black"
      >
        {t[0]}
      </text>
    );
    first_pass_repos_done = true;
  }

  // console.log(labels_x);
  return(
    <div style={{display:"flex",flexDirection:"row"}}>
      <svg width={100}
        transform={`translate(${[margin.left, margin.top].join(",")})`}>
      {labels_y}
      </svg>
      <div className={styles.heatmap}>
        <svg className={styles.svg_hm} width={hm_width} height={height}
          onMouseLeave={() => setHoveredCell(null)}>
          <g className={styles.svg_g} width={hm_width} height={max_y} fill='#FFFFFF'
            transform={`translate(${[margin.left, margin.top].join(",")})`}>
            {rects}
            {labels_x}
          </g>
        </svg>
      </div>
    </div>
  );
}
