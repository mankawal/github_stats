import HeatMapHorizontal from "./HeatMapHorizontal";
import styles from "./trh.module.css";
import {COLORS, THRESHOLDS} from "./constants";

export default function TopicRepoHeatMap({
  width, height, data, filterRepo, filterTopic
}) {
  const hm_width = 3000;
  return HeatMapHorizontal(
    width, height, hm_width, data,
    "repo_name" /* xkeyname */,
    "topic" , /* ykeyname */
    "total_metric_count", /* totalmetricname */
    "repo_metric_count", /* xmetricname */
    "repo_rank", /* xRankName */
    "overall_repo_rank", /* xrankOverallName */
    "topic_rank", /* yrankname */
    "pct_repo_to_topic", /* xToYPctMetricName  */
    filterRepo, filterTopic 
  );
}
