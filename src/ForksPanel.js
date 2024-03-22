import { React, useState } from "react";

import DataLoader from "./DataLoader";
import TopicRanked from "./TopicRanked";
import RepoRanked from "./RepoRanked";
import TopicRepoHeatMap from "./TopicRepoHeatMap";
import LangRanked from "./LangRanked";
import TopicLangHeatMap from "./TopicLangHeatMap";

import styles from "./forks-panel.module.css"

import { forks_topics_ranked } from "./data_forks_topics_ranked";
import { forks_repos_ranked } from "./data_forks_repos_ranked";
import { forks_topics_repos_raw } from "./data_forks_topics_repos";
import { forks_langs_ranked } from "./data_forks_langs";
import { forks_topics_langs_raw } from "./data_forks_topics_langs";

function DropDown({label, values, selectValue})
{
  return (
      <label>
        {label}
        <select name={`ForksPanel-${label}`}
          key={`ForksPanel-${label}`}
          defaultValue={values[0]}
          onChange={(e) => selectValue(e.target.value)}
        >
          {values.map((m, i) =>
            <option
              key={`ForksPanel-${label}-${m}`}
              value={m}>{m}
            </option>)}
        </select>
      </label>
  );
}
export default function ForksPanel() {
  const [monthYear, setMonthYear] = useState("12:2023");
  const [filterRepo, setFilterRepo] = useState(null);
  const [filterTopic, setFilterTopic] = useState(null);
  const [filterLang, setFilterLang] = useState(null);

  const [dataForksTopics, setDataForksTopics] =
    useState(forks_topics_ranked);

  const [dataForksReposBase, setDataForksReposBase] =
    useState(forks_repos_ranked);
  const [dataForksRepos, setDataForksRepos] =
    useState(forks_repos_ranked);
  const [dataForksTopicsRepos, setDataForksTopicsRepos] =
    useState(forks_topics_repos_raw);

  const [dataForksLangsBase, setDataForksLangsBase] =
    useState(forks_langs_ranked);
  const [dataForksLangs, setDataForksLangs] =
    useState(forks_langs_ranked);
  const [dataForksTopicsLangs, setDataForksTopicsLangs] =
    useState(forks_topics_langs_raw);

  const handleReposDataLoad = ((reposData) => {
    setDataForksReposBase(reposData);
    setDataForksRepos(reposData);
  });
  const handleLangsDataLoaded = ((langsData) => {
    setDataForksLangsBase(langsData);
    setDataForksLangs(langsData);
  });

  const handleTopicSelection = ((topic) => {
    if ((dataForksRepos !== undefined) && (dataForksRepos !== null)) {
      const newRepoData = ((topic === null)
        ? dataForksReposBase
        : (dataForksTopicsRepos
          .filter((e) => (e.topic === topic))
          .map((e) => { return {
            name: e.repo_name,
            metric_count: e.repo_metric_count
          }; })) );
      // console.log("new topic: ", topic, "new repo data: ", newRepoData);
      setDataForksRepos(newRepoData);
    }
    setFilterTopic(topic);
  });

  const month_year_combos = {
    "2023": ["10", "12"],
    "2024": ["1", "2"],
  };
  const [month, year] = monthYear.split(':');
  const max_topic_rank = 15;
  const max_repo_rank = 50;
  const max_lang_rank = 30;
  return (
    <div className={styles.parent}>
      <DropDown label="Year"
        values={Object.keys(month_year_combos)}
        selectValue = {(y) => {
          setMonthYear(`${month_year_combos[y][0]}:${y}`)
        }}
      />
      <DropDown label="Month"
        values={month_year_combos[year]}
        selectValue={(m) => {setMonthYear(`${m}:${year}`)}}
      />
      
      <DataLoader
        url='http://127.0.0.1:3001/api/topics'
        month_year={monthYear}
        req_body={{
          'month': month,
          'year': year,
          'sort_by': 'forks',
          'max_rank': max_topic_rank
        }}
        setData={setDataForksTopics}
      />
      <DataLoader
        url='http://127.0.0.1:3001/api/repos'
        month_year={monthYear}
        req_body={{
          'month': month,
          'year': year,
          'sort_by': 'forks',
          'max_rank': max_repo_rank,
        }}
        setData={handleReposDataLoad}
      />
      <DataLoader
        url='http://127.0.0.1:3001/api/topic_repo_stats'
        month_year={monthYear}
        req_body={{
          'month': month,
          'year': year,
          'sort_by': 'forks',
          'max_topic_rank': max_topic_rank,
          'max_repo_rank': max_repo_rank,
        }}
        setData={setDataForksTopicsRepos}
      />
      <DataLoader
        url='http://127.0.0.1:3001/api/languages'
        month_year={monthYear}
        req_body={{
          'month': month,
          'year': year,
          'sort_by': 'forks',
          'max_rank': max_lang_rank,
        }}
        setData={handleLangsDataLoaded}
      />
      <DataLoader
        url='http://127.0.0.1:3001/api/topic_lang_stats'
        month_year={monthYear}
        req_body={{
          'month': month,
          'year': year,
          'sort_by': 'forks',
          'max_topic_rank': max_topic_rank,
          'max_lang_rank': max_lang_rank,
        }}
        setData={setDataForksTopicsLangs}
      />

      <RepoRanked width={300} height={600}
        data={dataForksRepos} setHoveredRepo={setFilterRepo} />

      <TopicRanked width={600} height={600}
        data={dataForksTopics} setHoveredTopic={handleTopicSelection} />

      <TopicRepoHeatMap width={500} height={300}
        data={dataForksTopicsRepos}
        filterRepo={filterRepo} filterTopic={filterTopic} />

      <LangRanked width={300} height={600}
        data={dataForksLangs} setHoveredLang={setFilterLang} />

      <TopicLangHeatMap width={500} height={300}
        data={dataForksTopicsLangs}
        filterLang={filterLang} filterTopic={filterTopic} />
    </div>
  );
}
