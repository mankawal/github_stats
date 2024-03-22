import HeatMapHorizontal from "./HeatMapHorizontal";
import styles from "./trh.module.css";
import {COLORS, THRESHOLDS} from "./constants";

export default function TopicLangHeatMap({
  width, height, data, filterLang, filterTopic
}) {
  const hm_width = 1000;
  return HeatMapHorizontal(
    width, height, hm_width, data,
    "lang" /* xkeyname */,
    "topic" , /* ykeyname */
    "total_metric_count", /* totalmetricname */
    "lang_metric_count", /* xmetricname */
    "lang_rank", /* xRankName */
    "overall_lang_rank", /* xrankOverallName */
    "topic_rank", /* yrankname */
    "lang_pct", /* xToYPctMetricName  */
    filterLang, filterTopic 
  );
}
