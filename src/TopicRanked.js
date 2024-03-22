import { useEffect, useState } from "react";
import styles from "./pie-styles.module.css";
import DonutChart from "./DonutChart"

const margin = { x: 250, y: 50 };
const INFLEXION_PADDING = 20; // space between donut and label inflexion point

const colors = [
"#d2737d", 	"#c0a43c", 	"#f2510e", 	"#651be6", 	"#79806e", 	"#61da5e", 	"#cd2f00",
"#9348af", 	"#01ac53", 	"#c5a4fb", 	"#996635", 	"#b11573", 	"#4bb473", 	"#75d89e",
];

export default function TopicRanked({ width, height, data, setHoveredTopic }) {
  const max_val = data[0].metric_count;
  const min_val = data[data.length-1].metric_count;
  const val_range = max_val - min_val;
  // console.log("metric val, max: ", max_val, ", min_val: ", min_val);


  return DonutChart(width, height, margin, INFLEXION_PADDING,
    styles, colors, "topic", "metric_count", val_range, data,
    setHoveredTopic);
}
