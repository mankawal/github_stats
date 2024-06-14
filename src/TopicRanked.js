import { useEffect, useState } from "react";
import DonutChart from "./DonutChart"

export default function TopicRanked({ width, height, data, setHoveredTopic }) {
  const max_val = data[0].metric_count;
  const min_val = data[data.length-1].metric_count;
  const val_range = max_val - min_val;
  // console.log("metric val, max: ", max_val, ", min_val: ", min_val);


  return DonutChart(width, height,
    "topic", "metric_count", val_range, data,
    setHoveredTopic);
}
