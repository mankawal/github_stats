import { React, useState } from "react";

import TopicRanked from "./TopicRanked";
import RepoRanked from "./RepoRanked";
import TopicRepoHeatMap from "./TopicRepoHeatMap"

function DropDown({label, values, selectValue})
{
  console.log("Months drop-down values: ", values);
  return (
      <label>
        {label}
        <select name={`ForksPanel-${label}`}
          defaultValue={values[0]}
          onChange={(e) => selectValue(e.target.value)}
        >
          {values.map((m, i) => <option value={m}>{m}</option>)}
        </select>
      </label>
  );
}
export default function ForksPanel() {
  const [monthYear, setMonthYear] = useState("12:2023");
  const [filterRepo, setFilterRepo] = useState(null);
  const [filterTopic, setFilterTopic] = useState(null);

  const month_year_combos = {
    "2023": ["10", "12"],
    "2024": ["1"],
  };
  console.log("months: ", Object.keys(month_year_combos));
  const [month, year] = monthYear.split(':');
  return (
    <div display="flex" align-items="top">
      <DropDown label="Year"
        values={Object.keys(month_year_combos)}
        selectValue = {(y) => {
          setMonthYear(`${month_year_combos[y][0]}:${y}`)
        }} />
      <DropDown label="Month"
        values={month_year_combos[year]}
        selectValue={(m) => {setMonthYear(`${m}:${year}`)}} />
      <RepoRanked width={400} height={1000} month_year={monthYear}
        setHoveredRepo={setFilterRepo} />
      <TopicRanked width={700} height={1000} month_year={monthYear}
        setHoveredTopic={setFilterTopic} />
      <TopicRepoHeatMap width={300} height={1000} month_year={monthYear}
        filterRepo={filterRepo} filterTopic={filterTopic}/>
    </div>
  );
}
