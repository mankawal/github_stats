import { useEffect, useState } from 'react';
import styles from "./pie-styles.module.css";
// import DonutChart from "./DonutChart";
import Barplot from './Barplot';

import { forks_repos_ranked } from "./forks_repos_ranked";

const margin = { x: 20, y: 50 };
const data = forks_repos_ranked;
const INFLEXION_PADDING = 20; // space between donut and label inflexion point

const MAX_RANK = 30;

const colors = [
"#d2737d", 	"#c0a43c", 	"#f2510e", 	"#651be6", 	"#79806e", 	"#61da5e", 	"#cd2f00",
"#9348af", 	"#01ac53", 	"#c5a4fb", 	"#996635", 	"#b11573", 	"#4bb473", 	"#75d89e",
];

export default function RepoRanked({ width, height, month_year, setHoveredRepo }) {
  const [data, setData] = useState(forks_repos_ranked);
  const [month, year] = month_year.split(":");
  console.log("month_year: ", month_year, month, year);
  useEffect(() => {
    const queryDb = () => {
      const API = 'http://127.0.0.1:3001/api/repos';
      fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'month': month,
          'year': year,
          'sort_by': 'forks',
          'max_rank': MAX_RANK,
        }),
        mode: 'cors'
      })
        .then((resp) => {
          console.log("Db response: ", resp);
          return resp.json();
        })
        .then((res_data) => {
          console.log("query res: ", res_data);
          setData(res_data);
        });
    };
    if ( ((month >= 1) && (month <= 12)) ||
          ((year >= 2023) && (year <= 2024)) ) {
      queryDb();
    }
  }, [month, year]);
  const max_val = data[0].metric_count;
  const min_val = data[data.length-1].metric_count;
  const val_range = max_val - min_val;
  // console.log("metric val, max: ", max_val, ", min_val: ", min_val);

  return Barplot(width, height, "name", "metric_count", data, setHoveredRepo);

  /*
     return DonutChart(width, height, margin, INFLEXION_PADDING,
     styles, colors, "name", "metric_count", val_range, data,
     setHoveredRepo);
   */
}
