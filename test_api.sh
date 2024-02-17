#!/bin/bash

SVC_PORT=3001
function curl_call()
{
  svc_port=$SVC_PORT
  method=""
  if [[ "$1" == "GET" ]] || \
    [[ "$1" == "PUT" ]] || \
    [[ "$1" == "POST" ]] || \
    [[ "$1" == "DELETE" ]]; then
      method="-X $1"
      shift 1
  fi

  route=$1
  shift 1

  data_args=""
  if [[ $# -ge 1 ]]; then
    data_args="-d $*"
  fi

  >&2 echo "Running: curl -s http://localhost:$svc_port/api/$route $method $data_hdr $data_args"
  curl -s http://localhost:$svc_port/api/$route $method \
    -H 'Content-Type: application/json' \
    "$data_args" | jq
  >&2 echo -e "\n"
}

function curl_to_file()
{
  outfile=$1
  shift 1
  curl_call $* | tee $outfile
}

# Sort order: forks
curl_to_file ./sample.forks.topics_ranked POST topics '{"month": 12, "year": 2023, "sort_by": "forks", "max_rank": 10}'
curl_to_file ./sample.forks.repos_ranked  POST repos '{"month": 12, "year": 2023, "sort_by": "forks", "max_rank": 10}'
curl_to_file ./sample.forks.langs_ranked  POST languages '{"month": 12, "year": 2023, "sort_by": "forks", "max_rank": 10}'
curl_to_file ./sample.forks.topics_repos  POST topic_repo_stats '{"month": 12, "year": 2023, "sort_by": "forks", "max_topic_rank": 10, "max_repo_rank":10}'
curl_to_file ./sample.forks.topics_langs  POST topic_lang_stats '{"month": 12, "year": 2023, "sort_by": "forks", "max_topic_rank": 10, "max_lang_rank": 10}'

# Sort order: stars
curl_to_file ./sample.stars.topics_ranked POST topics '{"month": 12, "year": 2023, "sort_by": "stars", "max_rank": 10}'
curl_to_file ./sample.stars.repos_ranked  POST repos '{"month": 12, "year": 2023, "sort_by": "stars", "max_rank": 10}'
curl_to_file ./sample.stars.langs_ranked  POST languages '{"month": 12, "year": 2023, "sort_by": "stars", "max_rank": 10}'
curl_to_file ./sample.stars.topics_repos  POST topic_repo_stats '{"month": 12, "year": 2023, "sort_by": "stars", "max_topic_rank": 10, "max_repo_rank":10}'
curl_to_file ./sample.stars.topics_langs  POST topic_lang_stats '{"month": 12, "year": 2023, "sort_by": "stars", "max_topic_rank": 10, "max_lang_rank": 10}'
