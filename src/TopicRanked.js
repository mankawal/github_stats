import { React, useRef, useMemo, useState } from "react";
import * as d3 from "d3";
import styles from "./pie-styles.module.css";

import {COLORS, THRESHOLDS} from "./constants";
import { forks_topics_ranked } from "./forks_topics_ranked";

const defaultMargin = { x: 250, y: 50 };
const data = forks_topics_ranked;
const INFLEXION_PADDING = 20; // space between donut and label inflexion point

const colors = [
"#d2737d", 	"#c0a43c", 	"#f2510e", 	"#651be6", 	"#79806e", 	"#61da5e", 	"#cd2f00",
"#9348af", 	"#01ac53", 	"#c5a4fb", 	"#996635", 	"#b11573", 	"#4bb473", 	"#75d89e",
];

export default function TopicRepoHeatMap({
  width,
  height,
  event = false,
  margin = defaultMargin
}) {
	const ref = useRef(null);
  /* Move to parent */
  const [hoveredTopic, setHoveredTopic] = useState(null);

  const topics_keys = data.map((e) => e.topic);
  const max_val = data[0].metric_count;
  const min_val = data[data.length-1].metric_count;
  const val_range = max_val - min_val;
  console.log("metric val, max: ", max_val, ", min_val: ", min_val);

  const radius = Math.min(width - 2 * defaultMargin.x,
                          height - 2 * defaultMargin.y);
  const inner_radius = radius/5;

  console.log("styles:\n\t ", styles, "\n\tcontainer: \n\t", styles.container);

  const pie = useMemo(() => {
    const pie_gen = d3.pie().value((e) => e.metric_count);
    return pie_gen(data);
  }, [data]);
  const arg_gen = d3.arc();
  const shapes = pie.map((grp, i) => {
    // console.log("[shapes] grp: ", grp, "\ni: ", i);
    const slice_info = {
      innerRadius: inner_radius,
      outerRadius: (((radius - inner_radius)*grp.value)/(1.1*val_range)),
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    }
    const centroid = arg_gen.centroid(slice_info);
    const slice_path = arg_gen(slice_info);
    const inflexion_info = {
      innerRadius: radius + INFLEXION_PADDING,
      outerRadius: radius + INFLEXION_PADDING,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };
    const inflexion_pt = arg_gen.centroid(inflexion_info);

    const is_right_label = inflexion_pt[0] > 0;
    const label_pos_x = inflexion_pt[0] + 15 * (is_right_label ? 1 : -1);
    const text_anchor = is_right_label ? "start" : "end";
    const label = grp.data.topic + "(" + grp.value + ")";

    return (
      <g
        key = {`topic-ranked: + ${grp.data.topic}`}
        className = {styles.slice}
        onMouseEnter = {() => {
					console.log("mouse-enter: ", grp.data.topic, ", ref: \n", ref);
          if (ref.current) {
            ref.current.classList.add(styles.hasHighlight);
          }
        }}
        onMouseLeave = {() => {
					console.log("mouse-leave: ", grp.data.topic, ", ref: \n", ref);
          if (ref.current) {
            ref.current.classList.remove(styles.hasHighlight);
          }
        }}
      >
        <path d = {slice_path} fill = {colors[i]} />
        <circle cx = {centroid[0]} cy={centroid[1]} r = {2}
					fill = {"lightgray"}/>
        <line
          x1 = {centroid[0]}
          y1 = {centroid[1]}
          x2 = {inflexion_pt[0]}
          y2 = {inflexion_pt[1]}
          stroke = {"lightgray"}
          fill = {"lightgray"}
        />
        <line
          x1 = {inflexion_pt[0]}
          y1 = {inflexion_pt[1]}
          x2 = {label_pos_x}
          y2 = {inflexion_pt[1]}
          stroke = {"lightgray"}
          fill = {"lightgray"}
        />
        <text
          x = {label_pos_x + (is_right_label > 2 : -2)}
          y = {inflexion_pt[1]}
          textAnchor = {text_anchor}
          dominantBaseline = "middle"
          fontSize = {10}
        >
          {grp.data.topic}
        </text>
        <text
          x = {label_pos_x + (is_right_label > 2 : -2)}
          y = {inflexion_pt[1] + 11}
          textAnchor = {text_anchor}
          dominantBaseline = "middle"
          fontSize = {10}
        >
          ({grp.value})
        </text>
      </g>
    );
  });
  return (
    <svg width={width} height={height} style={{ display: "inline-block" }}>
      <g
        transform = {`translate(${width/2}, ${height/2})`}
        className = {styles.container}
        ref = {ref}
      >
        {shapes}
      </g>
    </svg>
  );
}
