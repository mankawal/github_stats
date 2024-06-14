const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./config/db')

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

//--- ROUTES ---

// Get first 10 github repo owners
app.get("/api/owners", (req, res) => {
  db.query("SELECT * FROM owner LIMIT 10;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    });
});

app.post("/api/q", (req, res) => {
  console.log("body: ", req.body,
    (req.body === undefined),
    (req.body.query === undefined),
    ", query: ", req.body.query);
  if ((req.body === undefined) ||
      (req.body.query === undefined) ||
      (req.body.query.length <= 2)) {
    return res.status(400).send({
      message: "Expected req body"});
  }
  const query_str = req.body.query;
  console.log("body: ", req.body, ", query: ", query_str);
  if (query_str === null) {
    return res.status(400).send({
      message: "Expected valid SQL statment in req body"});
    return;
  }
  // TODO: Verify that `query_str` is a valid SQL statement
  db.query(query_str, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

// Validates common Query params:
// month, year, sort_by (stars, forks);
function check_common_params(req, max_rank, ranks) {
  console.log("[param checker] request body: ", req.body);
  if (req.body === undefined) {
    return {err: true, err_msg: "Inalid request body"};
  }
  const month = req.body.month;
  if  ((month === undefined) || (month < 1) || (month > 12)) {
    return {err: true, err_msg: `Inalid month value: ${month}`};
  }
  const MIN_YEAR = 2023;
  const MAX_YEAR = 2024;
  const year = req.body.year;
  if ((year == undefined) || (year < MIN_YEAR) || (year > MAX_YEAR)) {
    return {err:true, err_msg:`Inalid year value: ${year}, valid range: (${MIN_YEAR} - ${MAX_YEAR})`};
  }
  const valid_sort_by = ['stars', 'forks'];
  const sort_by = req.body.sort_by;
  if (!valid_sort_by.includes(sort_by)) {
    return {err:true, err_msg:`Inalid sort_by value: ${sort_by},
      valid values: (${valid_sort_by}`};
  }
  /* TODO: Check for variadic arguments
    console.log(typeof(arguments));
  arguments.slice(2).foreach((rank) => { 
    if ((req.body[rank] === undef) || (req.body[rank] > max_rank)) {
      return {err: true, err_msg: `Invalid ${rank} value: ${req.body[rank]}`};
    }
  });
  */
  return {err: false};
}

app.post("/api/topic_repo_stats", (req, res) => {
  const validity_result = check_common_params(
    req, 100, 'max_repo_rank', 'max_repo_rank');
  if (validity_result.err) {
    return res.status(400).send({message: validity_result.err_msg});
  }
  const filter_month = req.body.month;
  const filter_year = req.body.year;
  const sort_by = req.body.sort_by;
  const max_repo_rank = req.body.max_repo_rank
  const max_topic_rank = req.body.max_topic_rank
  const query_str = `
with
  topic_repo_unranked as (
    select tr.topic, tr.repo_id, rs.${sort_by} as repo_metric_count, rs.language as lang
    from topic_to_repo as tr
    inner join repo_stats as rs
    on tr.at = rs.stats_updated_at and tr.repo_id = rs.repo_id
    where month(tr.at) = ${filter_month} and
      year(tr.at) = ${filter_year}
    order by repo_metric_count desc
  ),
  topic_repo as (
    select topic, r.full_name as repo_name, repo_metric_count, lang,
    dense_rank() over (
      order by repo_metric_count desc) overall_repo_rank
    from topic_repo_unranked
    inner join repo as r
    on repo_id = r.id
  ),
  topic_repo_pct as (
    select topic_repo.topic, rf.total_metric_count, repo_name, lang, repo_metric_count,
    ((repo_metric_count*100)/rf.total_metric_count) as pct_repo_to_topic,
    dense_rank() over(order by rf.total_metric_count desc) topic_rank,
    dense_rank() over(partition by topic order by repo_metric_count desc) as repo_rank,
    overall_repo_rank
    from topic_repo
    inner join (
      select topic, sum(repo_metric_count) as total_metric_count
      from topic_repo
      group by topic
    ) rf
    on topic_repo.topic = rf.topic
  )
select *
from  topic_repo_pct
where topic_rank <= ${max_topic_rank}
  and repo_rank <= ${max_repo_rank}
order by topic_rank, repo_rank;
  `;
  // console.log("Query string: ", query_str);
  db.query(query_str, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/topic_lang_stats", (req, res) => {
  const validity_result = check_common_params(
    req, 100, ['max_topic_rank', 'max_lang_rank']);
  if (validity_result.err) {
    return res.status(400).send({message: validity_result.err_msg});
  }
  const filter_month = req.body.month;
  const filter_year = req.body.year;
  const sort_by = req.body.sort_by;
  const max_topic_rank = req.body.max_topic_rank;
  const max_lang_rank = req.body.max_lang_rank;
  const query_str = `
with
  topics_unranked as
  (
    select tr.topic, sum(rs.${sort_by}) as topic_metric_count
    from topic_to_repo as tr
    inner join repo_stats as rs
    on tr.at = rs.stats_updated_at and tr.repo_id = rs.repo_id
    where month(tr.at) = ${filter_month} and
        year(tr.at) = ${filter_year}
    group by tr.topic
  ),
  topics_ranked as
  (
    select *,
      dense_rank() over(order by topic_metric_count desc) topic_rank
    from topics_unranked
  ),
  topics_lang_unranked as
  (
      select tr.topic as topic, rs.language as lang,
        sum(rs.${sort_by}) as lang_metric_count
      from topic_to_repo as tr
      inner join repo_stats as rs
      on tr.at = rs.stats_updated_at and tr.repo_id = rs.repo_id
      where month(tr.at) = ${filter_month} and
        year(tr.at) = ${filter_year} and
        rs.language != ""
      group by tr.topic, rs.language
  ),
  topic_lang_ranked as (
    select tr.topic, tr.topic_metric_count, tr.topic_rank,
      tlu.lang, tlu.lang_metric_count,
      (100 * tlu.lang_metric_count)/tr.topic_metric_count as lang_pct,
      dense_rank() over(
        partition by tr.topic order by tlu.lang_metric_count desc
      ) lang_rank
    from topics_ranked as tr
    inner join topics_lang_unranked as tlu
    on tr.topic = tlu.topic
    where tr.topic_rank <= ${max_topic_rank}
)
select * from topic_lang_ranked
where lang_rank<= ${max_lang_rank}
order by topic_rank, lang_rank;
  `;
  // console.log("Query string: ", query_str);
  db.query(query_str, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/topics", (req, res) => {
  const validity_result = check_common_params(req, 100, ['max_rank']);
  if (validity_result.err) {
    return res.status(400).send({message: validity_result.err_msg});
  }
  const filter_month = req.body.month;
  const filter_year = req.body.year;
  const sort_by = req.body.sort_by;
  const max_rank = req.body.max_rank;
  const query_str = `
with
  topic_unranked as (
    select tr.topic, sum(rs.${sort_by}) as metric_count
    from topic_to_repo as tr
    inner join repo_stats as rs
      on tr.at = rs.stats_updated_at and tr.repo_id = rs.repo_id
    where month(tr.at) = ${filter_month} and
      year(at) = ${filter_year}
    group by tr.topic
    order by metric_count desc
  ),
  topic_ranked as (
    select *, dense_rank() over (order by metric_count desc) metric_rank
    from topic_unranked
  )
select * from topic_ranked
where metric_rank <= ${max_rank}
order by metric_rank;
  `;
  // console.log("Query string: ", query_str);
  db.query(query_str, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/repos", (req, res) => {
  const validity_result = check_common_params(req, 100, ['max_rank']);
  if (validity_result.err) {
    return res.status(400).send({message: validity_result.err_msg});
  }
  const filter_month = req.body.month;
  const filter_year = req.body.year;
  const sort_by = req.body.sort_by;
  const max_rank = req.body.max_rank;
  const query_str = `
with
  repo_stats_ranked as (
    select repo_id, ${sort_by} as metric_count,
      dense_rank() over (order by ${sort_by} desc) metric_rank
    from repo_stats
    where month(stats_updated_at) = ${filter_month} and
      year(stats_updated_at) = ${filter_year}
  )
select r.full_name as name, rs.metric_count, rs.metric_rank
from (
  select * from repo_stats_ranked
  where metric_rank <= ${max_rank}
) rs
inner join repo as r
  on rs.repo_id = r.id
order by rs.metric_rank;
  `;
  // console.log("Query string: ", query_str);
  db.query(query_str, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/languages", (req, res) => {
  const validity_result = check_common_params(req, 100, ['max_rank']);
  if (validity_result.err) {
    return res.status(400).send({message: validity_result.err_msg});
  }
  const filter_month = req.body.month;
  const filter_year = req.body.year;
  const sort_by = req.body.sort_by;
  const max_rank = req.body.max_rank;
  const query_str = `
with
  lang_unranked as (
    select language as lang, sum(${sort_by}) as metric_count
    from repo_stats
    where month(stats_updated_at) = ${filter_month} and
      year(stats_updated_at) = ${filter_year}
    group by language 
  ),
  lang_ranked as (
    select *, dense_rank() over (order by metric_count desc) metric_rank
    from lang_unranked
  )
select * from lang_ranked
where metric_rank <= ${max_rank}
order by metric_rank;
  `;
  // console.log("Query string: ", query_str);
  db.query(query_str, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
