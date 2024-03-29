import { React, useMemo, useRef} from "react";
import * as d3 from "d3";

export default function DonutChart(
  width, height, margin, inflexion_padding, styles, colors,
  keyname, metricname, metric_range, data,
  setHoveredKey
) {
	const ref = useRef(null);
  /* Move to parent */
  const radius = Math.min(width - 2 * margin.x,
                          height - 2 * margin.y);
  const inner_radius = radius/3;

  const pie = useMemo(() => {
    const pie_gen = d3.pie().value((e) => e[metricname]);
    return pie_gen(data);
  }, [data, metricname]);
  const arg_gen = d3.arc();
  const shapes = pie.map((grp, i) => {
    // console.log("[shapes] grp: ", grp, "\ni: ", i);
    const slice_info = {
      innerRadius: inner_radius,
      outerRadius: radius, // (((radius)*(metric_range -grp.value))/(1.1*metric_range)),
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    }
    const centroid = arg_gen.centroid(slice_info);
    const slice_path = arg_gen(slice_info);
    const inflexion_info = {
      innerRadius: radius + inflexion_padding,
      outerRadius: radius + inflexion_padding,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };
    const inflexion_pt = arg_gen.centroid(inflexion_info);

    const is_right_label = inflexion_pt[0] > 0;
    const label_pos_x = inflexion_pt[0] + 15 * (is_right_label ? 1 : -1);
    const text_anchor = is_right_label ? "start" : "end";

    return (
      <g
        key = {`donut-${keyname}-${grp.data[keyname]}`}
        className = {styles.slice}
        onMouseEnter = {() => {
					// console.log("mouse-enter: ", grp.data[keyname], ", ref: \n", ref);
          if (ref.current) {
            setHoveredKey(grp.data[keyname]);
            ref.current.classList.add(styles.hasHighlight);
          }
        }}
        onMouseLeave = {() => {
					// console.log("mouse-leave: ", grp.data[keyname], ", ref: \n", ref);
          if (ref.current) {
            setHoveredKey(null);
            ref.current.classList.remove(styles.hasHighlight);
          }
        }}
      >
        <path d = {slice_path} fill = {colors[i]} />
        <circle cx = {centroid[0]} cy={centroid[1]} r = {2}
					fill = {"lightgray"}/>
        <line
          x1 = {centroid[0]}
          y1 = {centroid[1]}
          x2 = {inflexion_pt[0]}
          y2 = {inflexion_pt[1]}
          stroke = {"lightgray"}
          fill = {"lightgray"}
        />
        <line
          x1 = {inflexion_pt[0]}
          y1 = {inflexion_pt[1]}
          x2 = {label_pos_x}
          y2 = {inflexion_pt[1]}
          stroke = {"lightgray"}
          fill = {"lightgray"}
        />
        <text
          x = {label_pos_x + (is_right_label > 2 : -2)}
          y = {inflexion_pt[1]}
          textAnchor = {text_anchor}
          dominantBaseline = "middle"
          fontSize = {10}
        >
          {grp.data[keyname]}
        </text>
        <text
          x = {label_pos_x + (is_right_label > 2 : -2)}
          y = {inflexion_pt[1] + 11}
          textAnchor = {text_anchor}
          dominantBaseline = "middle"
          fontSize = {10}
        >
          ({grp.value})
        </text>
      </g>
    );
  });
  return (
    <svg width={width} height={height} style={{ display: "inline-block" }}>
      <g
        transform = {`translate(${width/2}, ${height/2})`}
        className = {styles.container}
        ref = {ref}
      >
        {shapes}
      </g>
    </svg>
  );
}
