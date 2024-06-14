import { useMemo } from "react";
import * as d3 from "d3";
import "./index.css"

const MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };
const BAR_PADDING = 0.1;

function BarItem(
  label, name, value, barHeight, barWidth, x, y, setHoveredKey) {
  const fix_y = 4;
  return (
    <g
      key={`${label}-${name}-${x}-${y}-bar`}
      onMouseEnter = {() => {
        setHoveredKey(name);
        console.log("bar-hovered: ", name);
      }}
      onMouseLeave = {() => {
          setHoveredKey(null);
        console.log("bar-hover cleared");
      }}
    >
      <rect
        x={x}
        y={y}
        width={barWidth}
        height={barHeight}
        opacity={0.7}
        stroke="#9d174d"
        fill="#9d174d"
        fillOpacity={0.3}
        strokeWidth={1}
        rx={1}
      />
      <text
        x={x + 7}
        y={y + fix_y + barHeight/2}
        textAnchor="start"
        alignmentBaseline="central"
        fontSize={12}
      >
        {name} ({value})
      </text>
    </g>
  );
  /*
  const springProps = useSpring({
    // the 'from' properties will be used only to animate the initialization of the component
    // if you put nothing it will be initialized with the first prop that is provided
    from: {
      value: 0,
      barWidth: 0,
      valueOpacity: 0,
    },
    to: {
      value: value,
      barWidth: barWidth,
      valueOpacity: barWidth > 80 ? 1 : 0,
      y,
    },
    config: {
      friction: 100,
    },
  });

  return (
    <g>
      <animated.rect
        x={x}
        y={springProps.y}
        width={springProps.barWidth}
        height={barHeight}
        opacity={0.7}
        stroke="#9d174d"
        fill="#9d174d"
        fillOpacity={0.3}
        strokeWidth={1}
        rx={1}
      />
      <animated.text
        x={springProps.barWidth?.to((width) => width - 7)}
        y={springProps.y?.to((y) => y + barHeight / 2)}
        textAnchor="end"
        alignmentBaseline="central"
        fontSize={12}
        opacity={springProps.valueOpacity}
      >
        {springProps.value?.to((value) => value.toFixed(0))}
      </animated.text>
      <animated.text
        x={x + 7}
        y={springProps.y?.to((y) => y + barHeight / 2)}
        textAnchor="start"
        alignmentBaseline="central"
        fontSize={12}
      >
        {name}
      </animated.text>
    </g>
  );
  */
  };

export default function Barplot(
  label, width, in_height,
  keyname, metricname, data,
  setHoveredKey) {
  // bounds = area inside the graph axis = calculated by substracting the margins
  // Y axis is for groups since the barplot is horizontal
  const groups = data.sort((a, b) => b[metricname] - a[metricname]).map((d) => d[keyname]);
  const barItemsHeight = groups.length * (20 + BAR_PADDING);

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = barItemsHeight - MARGIN.top - MARGIN.bottom;

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .domain(groups)
      .range([0, barItemsHeight])
      .padding(BAR_PADDING);
  }, [data, barItemsHeight]);

  // X axis
  // const max = d3.max(data.map((d) => d[metricname]));
  const max = data[0][metricname];
  const min = data[data.length - 1][metricname];
  const xScale = d3.scaleLinear().domain([0, max]).range([0, boundsWidth]);
  // const xScale = d3.scaleLinear().domain([min, max]).range([0, boundsWidth]);

  // console.log("BarItem keys: ", keyname, metricname, "\n", data.map((d) => `${d[keyname]}-${d[metricname]}-${yScale(d[keyname])}`))
  // Build the shapes
  const allShapes = data.map((d) => 
    BarItem(label,
      d[keyname],
      d[metricname],
      20, // yScale.bandwidth(),
      xScale(d[metricname]),
      xScale(0),
      yScale(d[keyname]),
      setHoveredKey
    )
  );

  // console.log("Test3", keyname, metricname, "height: ", boundsHeight, "bars height: ", barItemsHeight);
  return (
    <div>
      <h1 className="mb-4 flex text-2xl text-blue-800 capitalize justify-center">{label}</h1>
        <svg width={width} height={barItemsHeight + MARGIN.top + MARGIN.bottom}>
          <g transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}>
            {allShapes}
          </g>
        </svg>
    </div>
  );
};
/*
import styles from "./barplot.module.css";
      <div className={styles.barplot} width={width} height={height}>
        <svg className={styles.barplot_svg} width={width} height={30 + barItemsHeight}>
          <g className={styles.barplot_g}
            width={boundsWidth}
            height={30 + barItemsHeight}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}>
            {allShapes}
          </g>
        </svg>
      </div>
*/
