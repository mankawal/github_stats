import csv from "./ndx.json"
import crossfilter from "crossfilter2"
import * as d3 from "d3"
import * as dc from "dc"
import { useEffect, useState } from "react"
import { BarChart, PieChart, BubbleChart, LineChart, ChartContext, SelectMenu } from "react-dc-js"

function App() {
	const [newData, setNewData] = useState([])
	useEffect(() => {
		const queryDb = () => {
			const API = "http://127.0.0.1:3001/api/topic_repo_stats"
			fetch(API, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					month: 12,
					year: 2023,
					sort_by: "forks",
					max_topic_rank: 10,
					max_repo_rank: 10,
				}),
				mode: "cors",
			})
				.then((resp) => {
					console.log("Db response: ", resp)
					return resp.json()
				})
				.then((data) => {
					setNewData(data)
					console.log("query res: ", data)
				})
		}
		queryDb()
	}, [])

	console.log(newData.length)
	var cx
	var metricCount
	var topic
	if (newData.length > 0) {
		const cx = crossfilter(newData)
		topic = cx.dimension((d) => d.topic)
		metricCount = topic.group().reduceSum((d) => d.total_metric_count)
	}

	return (
		<div>
			<ChartContext>
				<BarChart
					id="testing"
					dimension={topic}
					group={metricCount}
					width={990}
					height={180}
					radius={80}
					centerBar={true}
					gap={5}
					x={d3.scaleBand()}
					ordering={function (d) {
						return -d.value
					}}
					xUnits={dc.units.ordinal}
				/>
			</ChartContext>
		</div>
	)
}

export default App
