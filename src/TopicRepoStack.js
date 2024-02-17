import React from "react";
import { BarStack } from "@visx/shape";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { AxisBottom } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { timeFormat, timeParse } from "d3-time-format";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { LegendOrdinal } from "@visx/legend";
import "./index.css";

const purple1 = "#6c5efb";
const purple2 = "#c998ff";
const purple3 = "#a44afe";
const background = "#eaedff";
const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white"
};

const data_raw = [
  {
    "topic": "hacktoberfest",
    "total_metric_count": "2592502",
    "repo_name": "docs",
    "lang": "JavaScript",
    "repo_metric_count": 62573,
    "pct_repo_to_topic": "2.4136",
    "topic_rank": 1,
    "repo_rank": 1,
    "overall_repo_rank": 7
  },
  {
    "topic": "hacktoberfest",
    "total_metric_count": "2592502",
    "repo_name": "free-programming-books",
    "lang": null,
    "repo_metric_count": 58875,
    "pct_repo_to_topic": "2.2710",
    "topic_rank": 1,
    "repo_rank": 2,
    "overall_repo_rank": 8
  },
  {
    "topic": "hacktoberfest",
    "total_metric_count": "2592502",
    "repo_name": "css-exercises",
    "lang": "HTML",
    "repo_metric_count": 52849,
    "pct_repo_to_topic": "2.0385",
    "topic_rank": 1,
    "repo_rank": 3,
    "overall_repo_rank": 10
  },
  {
    "topic": "hacktoberfest",
    "total_metric_count": "2592502",
    "repo_name": "Python",
    "lang": "Python",
    "repo_metric_count": 43592,
    "pct_repo_to_topic": "1.6815",
    "topic_rank": 1,
    "repo_rank": 4,
    "overall_repo_rank": 16
  },
  {
    "topic": "hacktoberfest",
    "total_metric_count": "2592502",
    "repo_name": "freeCodeCamp",
    "lang": "TypeScript",
    "repo_metric_count": 35200,
    "pct_repo_to_topic": "1.3578",
    "topic_rank": 1,
    "repo_rank": 5,
    "overall_repo_rank": 26
  },
  {
    "topic": "hacktoberfest",
    "total_metric_count": "2592502",
    "repo_name": "qmk_firmware",
    "lang": "C",
    "repo_metric_count": 35025,
    "pct_repo_to_topic": "1.3510",
    "topic_rank": 1,
    "repo_rank": 6,
    "overall_repo_rank": 27
  },
  {
    "topic": "hacktoberfest",
    "total_metric_count": "2592502",
    "repo_name": "material-ui",
    "lang": "TypeScript",
    "repo_metric_count": 30982,
    "pct_repo_to_topic": "1.1951",
    "topic_rank": 1,
    "repo_rank": 7,
    "overall_repo_rank": 30
  },
  {
    "topic": "hacktoberfest",
    "total_metric_count": "2592502",
    "repo_name": "DefinitelyTyped",
    "lang": "TypeScript",
    "repo_metric_count": 29746,
    "pct_repo_to_topic": "1.1474",
    "topic_rank": 1,
    "repo_rank": 8,
    "overall_repo_rank": 34
  },
  {
    "topic": "hacktoberfest",
    "total_metric_count": "2592502",
    "repo_name": "core",
    "lang": "Python",
    "repo_metric_count": 26274,
    "pct_repo_to_topic": "1.0135",
    "topic_rank": 1,
    "repo_rank": 9,
    "overall_repo_rank": 49
  },
  {
    "topic": "hacktoberfest",
    "total_metric_count": "2592502",
    "repo_name": "java-design-patterns",
    "lang": "Java",
    "repo_metric_count": 25862,
    "pct_repo_to_topic": "0.9976",
    "topic_rank": 1,
    "repo_rank": 10,
    "overall_repo_rank": 50
  },
  {
    "topic": "javascript",
    "total_metric_count": "2334183",
    "repo_name": "bootstrap",
    "lang": "JavaScript",
    "repo_metric_count": 79109,
    "pct_repo_to_topic": "3.3892",
    "topic_rank": 2,
    "repo_rank": 1,
    "overall_repo_rank": 4
  },
  {
    "topic": "javascript",
    "total_metric_count": "2334183",
    "repo_name": "react",
    "lang": "JavaScript",
    "repo_metric_count": 45672,
    "pct_repo_to_topic": "1.9567",
    "topic_rank": 2,
    "repo_rank": 2,
    "overall_repo_rank": 13
  },
  {
    "topic": "javascript",
    "total_metric_count": "2334183",
    "repo_name": "three.js",
    "lang": "JavaScript",
    "repo_metric_count": 35264,
    "pct_repo_to_topic": "1.5108",
    "topic_rank": 2,
    "repo_rank": 3,
    "overall_repo_rank": 25
  },
  {
    "topic": "javascript",
    "total_metric_count": "2334183",
    "repo_name": "freeCodeCamp",
    "lang": "TypeScript",
    "repo_metric_count": 35200,
    "pct_repo_to_topic": "1.5080",
    "topic_rank": 2,
    "repo_rank": 4,
    "overall_repo_rank": 26
  },
  {
    "topic": "javascript",
    "total_metric_count": "2334183",
    "repo_name": "vue",
    "lang": "TypeScript",
    "repo_metric_count": 34624,
    "pct_repo_to_topic": "1.4833",
    "topic_rank": 2,
    "repo_rank": 5,
    "overall_repo_rank": 28
  },
  {
    "topic": "javascript",
    "total_metric_count": "2334183",
    "repo_name": "You-Dont-Know-JS",
    "lang": null,
    "repo_metric_count": 33391,
    "pct_repo_to_topic": "1.4305",
    "topic_rank": 2,
    "repo_rank": 6,
    "overall_repo_rank": 29
  },
  {
    "topic": "javascript",
    "total_metric_count": "2334183",
    "repo_name": "material-ui",
    "lang": "TypeScript",
    "repo_metric_count": 30982,
    "pct_repo_to_topic": "1.3273",
    "topic_rank": 2,
    "repo_rank": 7,
    "overall_repo_rank": 30
  },
  {
    "topic": "javascript",
    "total_metric_count": "2334183",
    "repo_name": "javascript-algorithms",
    "lang": "JavaScript",
    "repo_metric_count": 29512,
    "pct_repo_to_topic": "1.2643",
    "topic_rank": 2,
    "repo_rank": 8,
    "overall_repo_rank": 35
  },
  {
    "topic": "javascript",
    "total_metric_count": "2334183",
    "repo_name": "free-programming-books-zh_CN",
    "lang": null,
    "repo_metric_count": 28070,
    "pct_repo_to_topic": "1.2026",
    "topic_rank": 2,
    "repo_rank": 9,
    "overall_repo_rank": 37
  },
  {
    "topic": "javascript",
    "total_metric_count": "2334183",
    "repo_name": "node",
    "lang": "JavaScript",
    "repo_metric_count": 28038,
    "pct_repo_to_topic": "1.2012",
    "topic_rank": 2,
    "repo_rank": 10,
    "overall_repo_rank": 38
  },
  {
    "topic": "python",
    "total_metric_count": "2332435",
    "repo_name": "tensorflow",
    "lang": "C++",
    "repo_metric_count": 89255,
    "pct_repo_to_topic": "3.8267",
    "topic_rank": 3,
    "repo_rank": 1,
    "overall_repo_rank": 2
  },
  {
    "topic": "python",
    "total_metric_count": "2332435",
    "repo_name": "CS-Notes",
    "lang": null,
    "repo_metric_count": 50786,
    "pct_repo_to_topic": "2.1774",
    "topic_rank": 3,
    "repo_rank": 2,
    "overall_repo_rank": 11
  },
  {
    "topic": "python",
    "total_metric_count": "2332435",
    "repo_name": "Python",
    "lang": "Python",
    "repo_metric_count": 43592,
    "pct_repo_to_topic": "1.8689",
    "topic_rank": 3,
    "repo_rank": 3,
    "overall_repo_rank": 16
  },
  {
    "topic": "python",
    "total_metric_count": "2332435",
    "repo_name": "system-design-primer",
    "lang": "Python",
    "repo_metric_count": 41628,
    "pct_repo_to_topic": "1.7847",
    "topic_rank": 3,
    "repo_rank": 4,
    "overall_repo_rank": 17
  },
  {
    "topic": "python",
    "total_metric_count": "2332435",
    "repo_name": "AutoGPT",
    "lang": "JavaScript",
    "repo_metric_count": 38574,
    "pct_repo_to_topic": "1.6538",
    "topic_rank": 3,
    "repo_rank": 5,
    "overall_repo_rank": 21
  },
  {
    "topic": "python",
    "total_metric_count": "2332435",
    "repo_name": "django",
    "lang": "Python",
    "repo_metric_count": 30703,
    "pct_repo_to_topic": "1.3163",
    "topic_rank": 3,
    "repo_rank": 6,
    "overall_repo_rank": 31
  },
  {
    "topic": "python",
    "total_metric_count": "2332435",
    "repo_name": "spark",
    "lang": "Scala",
    "repo_metric_count": 28078,
    "pct_repo_to_topic": "1.2038",
    "topic_rank": 3,
    "repo_rank": 7,
    "overall_repo_rank": 36
  },
  {
    "topic": "python",
    "total_metric_count": "2332435",
    "repo_name": "free-programming-books-zh_CN",
    "lang": null,
    "repo_metric_count": 28070,
    "pct_repo_to_topic": "1.2035",
    "topic_rank": 3,
    "repo_rank": 8,
    "overall_repo_rank": 37
  },
  {
    "topic": "python",
    "total_metric_count": "2332435",
    "repo_name": "core",
    "lang": "Python",
    "repo_metric_count": 26274,
    "pct_repo_to_topic": "1.1265",
    "topic_rank": 3,
    "repo_rank": 9,
    "overall_repo_rank": 49
  },
  {
    "topic": "python",
    "total_metric_count": "2332435",
    "repo_name": "scikit-learn",
    "lang": "Python",
    "repo_metric_count": 24973,
    "pct_repo_to_topic": "1.0707",
    "topic_rank": 3,
    "repo_rank": 10,
    "overall_repo_rank": 56
  },
  {
    "topic": "java",
    "total_metric_count": "1358747",
    "repo_name": "CS-Notes",
    "lang": null,
    "repo_metric_count": 50786,
    "pct_repo_to_topic": "3.7377",
    "topic_rank": 4,
    "repo_rank": 1,
    "overall_repo_rank": 11
  },
  {
    "topic": "java",
    "total_metric_count": "1358747",
    "repo_name": "JavaGuide",
    "lang": "Java",
    "repo_metric_count": 45198,
    "pct_repo_to_topic": "3.3264",
    "topic_rank": 4,
    "repo_rank": 2,
    "overall_repo_rank": 14
  },
  {
    "topic": "java",
    "total_metric_count": "1358747",
    "repo_name": "spring-boot",
    "lang": "Java",
    "repo_metric_count": 40052,
    "pct_repo_to_topic": "2.9477",
    "topic_rank": 4,
    "repo_rank": 3,
    "overall_repo_rank": 19
  },
  {
    "topic": "java",
    "total_metric_count": "1358747",
    "repo_name": "spark",
    "lang": "Scala",
    "repo_metric_count": 28078,
    "pct_repo_to_topic": "2.0665",
    "topic_rank": 4,
    "repo_rank": 4,
    "overall_repo_rank": 36
  },
  {
    "topic": "java",
    "total_metric_count": "1358747",
    "repo_name": "mall",
    "lang": "Java",
    "repo_metric_count": 27977,
    "pct_repo_to_topic": "2.0590",
    "topic_rank": 4,
    "repo_rank": 5,
    "overall_repo_rank": 39
  },
  {
    "topic": "java",
    "total_metric_count": "1358747",
    "repo_name": "dubbo",
    "lang": "Java",
    "repo_metric_count": 26370,
    "pct_repo_to_topic": "1.9408",
    "topic_rank": 4,
    "repo_rank": 6,
    "overall_repo_rank": 47
  },
  {
    "topic": "java",
    "total_metric_count": "1358747",
    "repo_name": "java-design-patterns",
    "lang": "Java",
    "repo_metric_count": 25862,
    "pct_repo_to_topic": "1.9034",
    "topic_rank": 4,
    "repo_rank": 7,
    "overall_repo_rank": 50
  },
  {
    "topic": "java",
    "total_metric_count": "1358747",
    "repo_name": "elasticsearch",
    "lang": "Java",
    "repo_metric_count": 23954,
    "pct_repo_to_topic": "1.7629",
    "topic_rank": 4,
    "repo_rank": 8,
    "overall_repo_rank": 63
  },
  {
    "topic": "java",
    "total_metric_count": "1358747",
    "repo_name": "Java",
    "lang": "Java",
    "repo_metric_count": 18894,
    "pct_repo_to_topic": "1.3905",
    "topic_rank": 4,
    "repo_rank": 9,
    "overall_repo_rank": 90
  },
  {
    "topic": "java",
    "total_metric_count": "1358747",
    "repo_name": "advanced-java",
    "lang": "Java",
    "repo_metric_count": 18754,
    "pct_repo_to_topic": "1.3802",
    "topic_rank": 4,
    "repo_rank": 10,
    "overall_repo_rank": 93
  },
  {
    "topic": "machine-learning",
    "total_metric_count": "1128892",
    "repo_name": "tensorflow",
    "lang": "C++",
    "repo_metric_count": 89255,
    "pct_repo_to_topic": "7.9064",
    "topic_rank": 5,
    "repo_rank": 1,
    "overall_repo_rank": 2
  },
  {
    "topic": "machine-learning",
    "total_metric_count": "1128892",
    "repo_name": "scikit-learn",
    "lang": "Python",
    "repo_metric_count": 24973,
    "pct_repo_to_topic": "2.2122",
    "topic_rank": 5,
    "repo_rank": 2,
    "overall_repo_rank": 56
  },
  {
    "topic": "machine-learning",
    "total_metric_count": "1128892",
    "repo_name": "transformers",
    "lang": "Python",
    "repo_metric_count": 23534,
    "pct_repo_to_topic": "2.0847",
    "topic_rank": 5,
    "repo_rank": 3,
    "overall_repo_rank": 65
  },
  {
    "topic": "machine-learning",
    "total_metric_count": "1128892",
    "repo_name": "pytorch",
    "lang": "Python",
    "repo_metric_count": 20330,
    "pct_repo_to_topic": "1.8009",
    "topic_rank": 5,
    "repo_rank": 4,
    "overall_repo_rank": 79
  },
  {
    "topic": "machine-learning",
    "total_metric_count": "1128892",
    "repo_name": "keras",
    "lang": "Python",
    "repo_metric_count": 19511,
    "pct_repo_to_topic": "1.7283",
    "topic_rank": 5,
    "repo_rank": 5,
    "overall_repo_rank": 84
  },
  {
    "topic": "machine-learning",
    "total_metric_count": "1128892",
    "repo_name": "caffe",
    "lang": "C++",
    "repo_metric_count": 18972,
    "pct_repo_to_topic": "1.6806",
    "topic_rank": 5,
    "repo_rank": 6,
    "overall_repo_rank": 89
  },
  {
    "topic": "machine-learning",
    "total_metric_count": "1128892",
    "repo_name": "yolov5",
    "lang": "Python",
    "repo_metric_count": 15170,
    "pct_repo_to_topic": "1.3438",
    "topic_rank": 5,
    "repo_rank": 7,
    "overall_repo_rank": 118
  },
  {
    "topic": "machine-learning",
    "total_metric_count": "1128892",
    "repo_name": "TensorFlow-Examples",
    "lang": "Jupyter Notebook",
    "repo_metric_count": 15126,
    "pct_repo_to_topic": "1.3399",
    "topic_rank": 5,
    "repo_rank": 8,
    "overall_repo_rank": 119
  },
  {
    "topic": "machine-learning",
    "total_metric_count": "1128892",
    "repo_name": "face_recognition",
    "lang": "Python",
    "repo_metric_count": 13286,
    "pct_repo_to_topic": "1.1769",
    "topic_rank": 5,
    "repo_rank": 9,
    "overall_repo_rank": 134
  },
  {
    "topic": "machine-learning",
    "total_metric_count": "1128892",
    "repo_name": "handson-ml",
    "lang": "Jupyter Notebook",
    "repo_metric_count": 13012,
    "pct_repo_to_topic": "1.1526",
    "topic_rank": 5,
    "repo_rank": 10,
    "overall_repo_rank": 137
  },
  {
    "topic": "deep-learning",
    "total_metric_count": "1098981",
    "repo_name": "tensorflow",
    "lang": "C++",
    "repo_metric_count": 89255,
    "pct_repo_to_topic": "8.1216",
    "topic_rank": 6,
    "repo_rank": 1,
    "overall_repo_rank": 2
  },
  {
    "topic": "deep-learning",
    "total_metric_count": "1098981",
    "repo_name": "opencv",
    "lang": "C++",
    "repo_metric_count": 55810,
    "pct_repo_to_topic": "5.0783",
    "topic_rank": 6,
    "repo_rank": 2,
    "overall_repo_rank": 9
  },
  {
    "topic": "deep-learning",
    "total_metric_count": "1098981",
    "repo_name": "transformers",
    "lang": "Python",
    "repo_metric_count": 23534,
    "pct_repo_to_topic": "2.1414",
    "topic_rank": 6,
    "repo_rank": 3,
    "overall_repo_rank": 65
  },
  {
    "topic": "deep-learning",
    "total_metric_count": "1098981",
    "repo_name": "stable-diffusion-webui",
    "lang": "Python",
    "repo_metric_count": 22971,
    "pct_repo_to_topic": "2.0902",
    "topic_rank": 6,
    "repo_rank": 4,
    "overall_repo_rank": 69
  },
  {
    "topic": "deep-learning",
    "total_metric_count": "1098981",
    "repo_name": "pytorch",
    "lang": "Python",
    "repo_metric_count": 20330,
    "pct_repo_to_topic": "1.8499",
    "topic_rank": 6,
    "repo_rank": 5,
    "overall_repo_rank": 79
  },
  {
    "topic": "deep-learning",
    "total_metric_count": "1098981",
    "repo_name": "keras",
    "lang": "Python",
    "repo_metric_count": 19511,
    "pct_repo_to_topic": "1.7754",
    "topic_rank": 6,
    "repo_rank": 6,
    "overall_repo_rank": 84
  },
  {
    "topic": "deep-learning",
    "total_metric_count": "1098981",
    "repo_name": "caffe",
    "lang": "C++",
    "repo_metric_count": 18972,
    "pct_repo_to_topic": "1.7263",
    "topic_rank": 6,
    "repo_rank": 7,
    "overall_repo_rank": 89
  },
  {
    "topic": "deep-learning",
    "total_metric_count": "1098981",
    "repo_name": "yolov5",
    "lang": "Python",
    "repo_metric_count": 15170,
    "pct_repo_to_topic": "1.3804",
    "topic_rank": 6,
    "repo_rank": 8,
    "overall_repo_rank": 118
  },
  {
    "topic": "deep-learning",
    "total_metric_count": "1098981",
    "repo_name": "TensorFlow-Examples",
    "lang": "Jupyter Notebook",
    "repo_metric_count": 15126,
    "pct_repo_to_topic": "1.3764",
    "topic_rank": 6,
    "repo_rank": 9,
    "overall_repo_rank": 119
  },
  {
    "topic": "deep-learning",
    "total_metric_count": "1098981",
    "repo_name": "handson-ml",
    "lang": "Jupyter Notebook",
    "repo_metric_count": 13012,
    "pct_repo_to_topic": "1.1840",
    "topic_rank": 6,
    "repo_rank": 10,
    "overall_repo_rank": 137
  },
  {
    "topic": "react",
    "total_metric_count": "1043537",
    "repo_name": "ChatGPT-Next-Web",
    "lang": "TypeScript",
    "repo_metric_count": 48517,
    "pct_repo_to_topic": "4.6493",
    "topic_rank": 7,
    "repo_rank": 1,
    "overall_repo_rank": 12
  },
  {
    "topic": "react",
    "total_metric_count": "1043537",
    "repo_name": "react",
    "lang": "JavaScript",
    "repo_metric_count": 45672,
    "pct_repo_to_topic": "4.3767",
    "topic_rank": 7,
    "repo_rank": 2,
    "overall_repo_rank": 13
  },
  {
    "topic": "react",
    "total_metric_count": "1043537",
    "repo_name": "ant-design",
    "lang": "TypeScript",
    "repo_metric_count": 43650,
    "pct_repo_to_topic": "4.1829",
    "topic_rank": 7,
    "repo_rank": 3,
    "overall_repo_rank": 15
  },
  {
    "topic": "react",
    "total_metric_count": "1043537",
    "repo_name": "freeCodeCamp",
    "lang": "TypeScript",
    "repo_metric_count": 35200,
    "pct_repo_to_topic": "3.3731",
    "topic_rank": 7,
    "repo_rank": 4,
    "overall_repo_rank": 26
  },
  {
    "topic": "react",
    "total_metric_count": "1043537",
    "repo_name": "material-ui",
    "lang": "TypeScript",
    "repo_metric_count": 30982,
    "pct_repo_to_topic": "2.9689",
    "topic_rank": 7,
    "repo_rank": 5,
    "overall_repo_rank": 30
  },
  {
    "topic": "react",
    "total_metric_count": "1043537",
    "repo_name": "free-programming-books-zh_CN",
    "lang": null,
    "repo_metric_count": 28070,
    "pct_repo_to_topic": "2.6899",
    "topic_rank": 7,
    "repo_rank": 6,
    "overall_repo_rank": 37
  },
  {
    "topic": "react",
    "total_metric_count": "1043537",
    "repo_name": "create-react-app",
    "lang": "JavaScript",
    "repo_metric_count": 26895,
    "pct_repo_to_topic": "2.5773",
    "topic_rank": 7,
    "repo_rank": 7,
    "overall_repo_rank": 43
  },
  {
    "topic": "react",
    "total_metric_count": "1043537",
    "repo_name": "next.js",
    "lang": "JavaScript",
    "repo_metric_count": 25396,
    "pct_repo_to_topic": "2.4336",
    "topic_rank": 7,
    "repo_rank": 8,
    "overall_repo_rank": 54
  },
  {
    "topic": "react",
    "total_metric_count": "1043537",
    "repo_name": "react-native",
    "lang": "Java",
    "repo_metric_count": 24085,
    "pct_repo_to_topic": "2.3080",
    "topic_rank": 7,
    "repo_rank": 9,
    "overall_repo_rank": 61
  },
  {
    "topic": "react",
    "total_metric_count": "1043537",
    "repo_name": "ionic-framework",
    "lang": "TypeScript",
    "repo_metric_count": 13738,
    "pct_repo_to_topic": "1.3165",
    "topic_rank": 7,
    "repo_rank": 10,
    "overall_repo_rank": 124
  },
  {
    "topic": "android",
    "total_metric_count": "927995",
    "repo_name": "free-programming-books-zh_CN",
    "lang": null,
    "repo_metric_count": 28070,
    "pct_repo_to_topic": "3.0248",
    "topic_rank": 8,
    "repo_rank": 1,
    "overall_repo_rank": 37
  },
  {
    "topic": "android",
    "total_metric_count": "927995",
    "repo_name": "flutter",
    "lang": "Dart",
    "repo_metric_count": 26546,
    "pct_repo_to_topic": "2.8606",
    "topic_rank": 8,
    "repo_rank": 2,
    "overall_repo_rank": 46
  },
  {
    "topic": "android",
    "total_metric_count": "927995",
    "repo_name": "FreeRDP",
    "lang": "C",
    "repo_metric_count": 24690,
    "pct_repo_to_topic": "2.6606",
    "topic_rank": 8,
    "repo_rank": 3,
    "overall_repo_rank": 58
  },
  {
    "topic": "android",
    "total_metric_count": "927995",
    "repo_name": "react-native",
    "lang": "Java",
    "repo_metric_count": 24085,
    "pct_repo_to_topic": "2.5954",
    "topic_rank": 8,
    "repo_rank": 4,
    "overall_repo_rank": 61
  },
  {
    "topic": "android",
    "total_metric_count": "927995",
    "repo_name": "MagiskOnWSALocal",
    "lang": "Shell",
    "repo_metric_count": 21748,
    "pct_repo_to_topic": "2.3435",
    "topic_rank": 8,
    "repo_rank": 5,
    "overall_repo_rank": 73
  },
  {
    "topic": "android",
    "total_metric_count": "927995",
    "repo_name": "android-open-project",
    "lang": null,
    "repo_metric_count": 12016,
    "pct_repo_to_topic": "1.2948",
    "topic_rank": 8,
    "repo_rank": 6,
    "overall_repo_rank": 162
  },
  {
    "topic": "android",
    "total_metric_count": "927995",
    "repo_name": "shadowsocks-android",
    "lang": "Kotlin",
    "repo_metric_count": 11677,
    "pct_repo_to_topic": "1.2583",
    "topic_rank": 8,
    "repo_rank": 7,
    "overall_repo_rank": 169
  },
  {
    "topic": "android",
    "total_metric_count": "927995",
    "repo_name": "architecture-samples",
    "lang": "Kotlin",
    "repo_metric_count": 11613,
    "pct_repo_to_topic": "1.2514",
    "topic_rank": 8,
    "repo_rank": 8,
    "overall_repo_rank": 171
  },
  {
    "topic": "android",
    "total_metric_count": "927995",
    "repo_name": "AndroidUtilCode",
    "lang": "Java",
    "repo_metric_count": 10681,
    "pct_repo_to_topic": "1.1510",
    "topic_rank": 8,
    "repo_rank": 9,
    "overall_repo_rank": 186
  },
  {
    "topic": "android",
    "total_metric_count": "927995",
    "repo_name": "awesome-android-ui",
    "lang": null,
    "repo_metric_count": 10341,
    "pct_repo_to_topic": "1.1143",
    "topic_rank": 8,
    "repo_rank": 10,
    "overall_repo_rank": 197
  },
  {
    "topic": "typescript",
    "total_metric_count": "706030",
    "repo_name": "ant-design",
    "lang": "TypeScript",
    "repo_metric_count": 43650,
    "pct_repo_to_topic": "6.1825",
    "topic_rank": 9,
    "repo_rank": 1,
    "overall_repo_rank": 15
  },
  {
    "topic": "typescript",
    "total_metric_count": "706030",
    "repo_name": "material-ui",
    "lang": "TypeScript",
    "repo_metric_count": 30982,
    "pct_repo_to_topic": "4.3882",
    "topic_rank": 9,
    "repo_rank": 2,
    "overall_repo_rank": 30
  },
  {
    "topic": "typescript",
    "total_metric_count": "706030",
    "repo_name": "DefinitelyTyped",
    "lang": "TypeScript",
    "repo_metric_count": 29746,
    "pct_repo_to_topic": "4.2131",
    "topic_rank": 9,
    "repo_rank": 3,
    "overall_repo_rank": 34
  },
  {
    "topic": "typescript",
    "total_metric_count": "706030",
    "repo_name": "vscode",
    "lang": "TypeScript",
    "repo_metric_count": 27839,
    "pct_repo_to_topic": "3.9430",
    "topic_rank": 9,
    "repo_rank": 4,
    "overall_repo_rank": 40
  },
  {
    "topic": "typescript",
    "total_metric_count": "706030",
    "repo_name": "angular",
    "lang": "TypeScript",
    "repo_metric_count": 24957,
    "pct_repo_to_topic": "3.5348",
    "topic_rank": 9,
    "repo_rank": 5,
    "overall_repo_rank": 57
  },
  {
    "topic": "typescript",
    "total_metric_count": "706030",
    "repo_name": "ionic-framework",
    "lang": "TypeScript",
    "repo_metric_count": 13738,
    "pct_repo_to_topic": "1.9458",
    "topic_rank": 9,
    "repo_rank": 6,
    "overall_repo_rank": 124
  },
  {
    "topic": "typescript",
    "total_metric_count": "706030",
    "repo_name": "TypeScript",
    "lang": "TypeScript",
    "repo_metric_count": 12423,
    "pct_repo_to_topic": "1.7596",
    "topic_rank": 9,
    "repo_rank": 7,
    "overall_repo_rank": 150
  },
  {
    "topic": "typescript",
    "total_metric_count": "706030",
    "repo_name": "angular-cli",
    "lang": "TypeScript",
    "repo_metric_count": 12151,
    "pct_repo_to_topic": "1.7210",
    "topic_rank": 9,
    "repo_rank": 8,
    "overall_repo_rank": 158
  },
  {
    "topic": "typescript",
    "total_metric_count": "706030",
    "repo_name": "desktop",
    "lang": "TypeScript",
    "repo_metric_count": 9842,
    "pct_repo_to_topic": "1.3940",
    "topic_rank": 9,
    "repo_rank": 9,
    "overall_repo_rank": 212
  },
  {
    "topic": "typescript",
    "total_metric_count": "706030",
    "repo_name": "30-Days-Of-JavaScript",
    "lang": "JavaScript",
    "repo_metric_count": 9448,
    "pct_repo_to_topic": "1.3382",
    "topic_rank": 9,
    "repo_rank": 10,
    "overall_repo_rank": 230
  },
  {
    "topic": "nodejs",
    "total_metric_count": "653498",
    "repo_name": "freeCodeCamp",
    "lang": "TypeScript",
    "repo_metric_count": 35200,
    "pct_repo_to_topic": "5.3864",
    "topic_rank": 10,
    "repo_rank": 1,
    "overall_repo_rank": 26
  },
  {
    "topic": "nodejs",
    "total_metric_count": "653498",
    "repo_name": "node",
    "lang": "JavaScript",
    "repo_metric_count": 28038,
    "pct_repo_to_topic": "4.2904",
    "topic_rank": 10,
    "repo_rank": 2,
    "overall_repo_rank": 38
  },
  {
    "topic": "nodejs",
    "total_metric_count": "653498",
    "repo_name": "electron",
    "lang": "C++",
    "repo_metric_count": 15377,
    "pct_repo_to_topic": "2.3530",
    "topic_rank": 10,
    "repo_rank": 3,
    "overall_repo_rank": 115
  },
  {
    "topic": "nodejs",
    "total_metric_count": "653498",
    "repo_name": "NeteaseCloudMusicApi",
    "lang": "JavaScript",
    "repo_metric_count": 15248,
    "pct_repo_to_topic": "2.3333",
    "topic_rank": 10,
    "repo_rank": 4,
    "overall_repo_rank": 117
  },
  {
    "topic": "nodejs",
    "total_metric_count": "653498",
    "repo_name": "express",
    "lang": "JavaScript",
    "repo_metric_count": 12400,
    "pct_repo_to_topic": "1.8975",
    "topic_rank": 10,
    "repo_rank": 5,
    "overall_repo_rank": 152
  },
  {
    "topic": "nodejs",
    "total_metric_count": "653498",
    "repo_name": "30-seconds-of-code",
    "lang": "JavaScript",
    "repo_metric_count": 12099,
    "pct_repo_to_topic": "1.8514",
    "topic_rank": 10,
    "repo_rank": 6,
    "overall_repo_rank": 159
  },
  {
    "topic": "nodejs",
    "total_metric_count": "653498",
    "repo_name": "curriculum",
    "lang": null,
    "repo_metric_count": 11391,
    "pct_repo_to_topic": "1.7431",
    "topic_rank": 10,
    "repo_rank": 7,
    "overall_repo_rank": 177
  },
  {
    "topic": "nodejs",
    "total_metric_count": "653498",
    "repo_name": "axios",
    "lang": "JavaScript",
    "repo_metric_count": 10840,
    "pct_repo_to_topic": "1.6588",
    "topic_rank": 10,
    "repo_rank": 8,
    "overall_repo_rank": 184
  },
  {
    "topic": "nodejs",
    "total_metric_count": "653498",
    "repo_name": "socket.io",
    "lang": "TypeScript",
    "repo_metric_count": 10249,
    "pct_repo_to_topic": "1.5683",
    "topic_rank": 10,
    "repo_rank": 9,
    "overall_repo_rank": 200
  },
  {
    "topic": "nodejs",
    "total_metric_count": "653498",
    "repo_name": "Ghost",
    "lang": "JavaScript",
    "repo_metric_count": 9982,
    "pct_repo_to_topic": "1.5275",
    "topic_rank": 10,
    "repo_rank": 10,
    "overall_repo_rank": 206
  }
]

const getDate = (d) => d.topic;

let tooltipTimeout;

export default function TemperatureBarStack({
  width,
  height,
  event = false,
  margin = defaultMargin
}) {
  const {
    tooltipOpen,
    tooltipTop,
    tooltipLeft,
    hideTooltip,
    showTooltip,
    tooltipData
  } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  if (width === undefined) width = 800
  if (height === undefined) height = 600
  if (width < 10) return null;

  const xMax = width;
  const yMax = height - margin.top - 100;

  const dmap = new Map();
  let max = 0;
  const data_map = data_raw.reduce((dmap_in, e, idx) => {
    if (!dmap.has(e.topic)) {
      dmap.set(e.topic, {
        "topic": e.topic,
        "total_metric_count": Math.floor(e.total_metric_count/50),
        "topic_rank": e.topic_rank,
      });
      if (max < e.total_metric_count/50) {
        max = Math.floor(e.total_metric_count/50);
      }
    }
    dmap.get(e.topic)[e.repo_name] = e.repo_metric_count;
    /*
      {
      "lang": e.lang,
      "repo_metric_count": e.repo_metric_count,
      "repo_rank": e.repo_rank,
      "overall_repo_rank": e.overall_repo_rank,
    };
    */
    return dmap;
  }, {});
  const data = Array.from(data_map.values());
  console.log("max: ", max, "data: ", data);

  const xScale = scaleBand({ domain: data.map(getDate), padding: 0.2 });
  const temparatureScale = scaleLinear({
    domain: [0, 2592502],
    nice: true
  });

  xScale.rangeRound([0, xMax]);
  temparatureScale.range([yMax, 0]);

  const keys_set = new Set(data_raw.map((e) => e.repo_name));
  const keys = Array.from(keys_set);

  const colorArray = [
    '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9E00B3', 
    '#FF3390', '#CCCD00', '#66EF4D', '#4DA0CC', '#9300B3', 
    '#FF33a0', '#CCC000', '#66E04D', '#4D30CC', '#9700B3', 
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']; 
  const colorScale = scaleOrdinal({
    domain: keys,
    range: colorArray,
  });

  return width < 10 ? null : (
    <div style={{ position: "relative" }}>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={background}
          rx={14}
        />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={xScale}
          yScale={temparatureScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
          xOffset={xScale.bandwidth() / 2}
        />
        <Group top={margin.top}>
          <BarStack
            data={data}
            keys={keys}
            x={getDate}
            xScale={xScale}
            yScale={temparatureScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                    onClick={() => {
                      if (event) alert(`Clicked: ${JSON.stringify(bar)}`);
                    }}
                    onMouseLeave={() => {
                      tooltipTimeout = window.setTimeout(() => {
                        hideTooltip();
                      }, 300);
                    }}
                    onMouseMove={(event) => {
                      if (tooltipTimeout) clearTimeout(tooltipTimeout);
                      const top = event.clientY - margin.top - bar.height;
                      const left = bar.x + bar.width / 2;
                      showTooltip({
                        tooltipData: bar,
                        tooltipTop: top,
                        tooltipLeft: left
                      });
                    }}
                  />
                ))
              )
            }
          </BarStack>
        </Group>
        <AxisBottom
          top={yMax + margin.top}
          scale={xScale}
          tickFormat={(topic) => topic}
          stroke={purple3}
          tickStroke={purple3}
          tickLabelProps={() => ({
            fill: purple3,
            fontSize: 11,
            textAnchor: "middle"
          })}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: margin.top / 2 - 10,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: 14
        }}
      >
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          labelMargin="0 15px 0 0"
        />
      </div>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div style={{ color: colorScale(tooltipData.key) }}>
            <strong>{tooltipData.key}</strong>
          </div>
          <div>{tooltipData.bar.data[tooltipData.key]}℉</div>
          <div>
            <small>{getDate(tooltipData.bar.data)}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
