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

const getTopics = (d) => d.topic;

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
  let repo_count_agg_per_topic = [];
  const data_map = data_raw.reduce((dmap_in, e, idx) => {
    if (!dmap.has(e.topic)) {
      dmap.set(e.topic, {
        "topic": e.topic,
        "total_metric_count": Math.floor(e.total_metric_count/50),
        "topic_rank": e.topic_rank,
      });
      repo_count_agg_per_topic.push(0);
    }
    dmap.get(e.topic)[e.repo_name] = e.repo_metric_count;
    repo_count_agg_per_topic[repo_count_agg_per_topic.length - 1] += 
      e.repo_metric_count;
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
  console.log("repo_counts_per_agg: ", repo_count_agg_per_topic);

  const xScale = scaleBand({ domain: data.map(getTopics), padding: 0.2 });
  const temparatureScale = scaleLinear({
    domain: [0, Math.max(...repo_count_agg_per_topic)],
    nice: true
  });

  xScale.rangeRound([0, xMax]);
  temparatureScale.range([yMax, 0]);

  const keys_set = new Set(data_raw.map((e) => e.repo_name));
  const keys = Array.from(keys_set);

  const colorArray = [
    "#63b598", 	"#ce7d78", 	"#ea9e70", 	"#a48a9e", 	"#c6e1e8", 	"#648177", 	"#0d5ac1",
"#f205e6", 	"#1c0365", 	"#14a9ad", 	"#4ca2f9", 	"#a4e43f", 	"#d298e2", 	"#6119d0",
"#d2737d", 	"#c0a43c", 	"#f2510e", 	"#651be6", 	"#79806e", 	"#61da5e", 	"#cd2f00",
"#9348af", 	"#01ac53", 	"#c5a4fb", 	"#996635", 	"#b11573", 	"#4bb473", 	"#75d89e",
"#2f3f94", 	"#2f7b99", 	"#da967d", 	"#34891f", 	"#b0d87b", 	"#ca4751", 	"#7e50a8",
"#c4d647", 	"#e0eeb8", 	"#11dec1", 	"#289812", 	"#566ca0", 	"#ffdbe1", 	"#2f1179",
"#935b6d", 	"#916988", 	"#513d98", 	"#aead3a", 	"#9e6d71", 	"#4b5bdc", 	"#0cd36d",
"#250662", 	"#cb5bea", 	"#228916", 	"#ac3e1b", 	"#df514a", 	"#539397", 	"#880977",
"#f697c1", 	"#ba96ce", 	"#679c9d", 	"#c6c42c", 	"#5d2c52", 	"#48b41b", 	"#e1cf3b",
"#5be4f0", 	"#57c4d8", 	"#a4d17a", 	"#225b8", 	"#be608b", 	"#96b00c", 	"#088baf",
"#f158bf", 	"#e145ba", 	"#ee91e3", 	"#05d371", 	"#5426e0", 	"#4834d0", 	"#802234",
"#6749e8", 	"#0971f0", 	"#8fb413", 	"#b2b4f0", 	"#c3c89d", 	"#c9a941", 	"#41d158",
"#fb21a3", 	"#51aed9", 	"#5bb32d", 	"#807fb", 	"#21538e", 	"#89d534", 	"#d36647",
"#7fb411", 	"#0023b8", 	"#3b8c2a", 	"#986b53", 	"#f50422", 	"#983f7a", 	"#ea24a3",
"#79352c", 	"#521250", 	"#c79ed2", 	"#d6dd92", 	"#e33e52", 	"#b2be57", 	"#fa06ec",
"#1bb699", 	"#6b2e5f", 	"#64820f", 	"#1c271", 	"#21538e", 	"#89d534", 	"#d36647",
"#7fb411", 	"#0023b8", 	"#3b8c2a", 	"#986b53", 	"#f50422", 	"#983f7a", 	"#ea24a3",
"#79352c", 	"#521250", 	"#c79ed2", 	"#d6dd92", 	"#e33e52", 	"#b2be57", 	"#fa06ec",
"#1bb699", 	"#6b2e5f", 	"#64820f", 	"#1c271", 	"#9cb64a", 	"#996c48", 	"#9ab9b7",
"#06e052", 	"#e3a481", 	"#0eb621", 	"#fc458e", 	"#b2db15", 	"#aa226d", 	"#792ed8",
"#73872a", 	"#520d3a", 	"#cefcb8", 	"#a5b3d9", 	"#7d1d85", 	"#c4fd57", 	"#f1ae16",
"#8fe22a", 	"#ef6e3c", 	"#243eeb", 	"#1dc18", 	"#dd93fd", 	"#3f8473", 	"#e7dbce",
"#421f79", 	"#7a3d93", 	"#635f6d", 	"#93f2d7", 	"#9b5c2a", 	"#15b9ee", 	"#0f5997",
"#409188", 	"#911e20", 	"#1350ce", 	"#10e5b1", 	"#fff4d7", 	"#cb2582", 	"#ce00be",
"#32d5d6", 	"#17232", 	"#608572", 	"#c79bc2", 	"#00f87c", 	"#77772a", 	"#6995ba",
"#fc6b57", 	"#f07815", 	"#8fd883", 	"#060e27", 	"#96e591", 	"#21d52e", 	"#d00043",
"#b47162", 	"#1ec227", 	"#4f0f6f", 	"#1d1d58", 	"#947002", 	"#bde052", 	"#e08c56",
"#28fcfd", 	"#bb09b", 	"#36486a", 	"#d02e29", 	"#1ae6db", 	"#3e464c", 	"#a84a8f",
"#911e7e", 	"#3f16d9", 	"#0f525f", 	"#ac7c0a", 	"#b4c086", 	"#c9d730", 	"#30cc49",
"#3d6751", 	"#fb4c03", 	"#640fc1", 	"#62c03e", 	"#d3493a", 	"#88aa0b", 	"#406df9",
"#615af0", 	"#4be47", 	"#2a3434", 	"#4a543f", 	"#79bca0", 	"#a8b8d4", 	"#00efd4",
"#7ad236", 	"#7260d8", 	"#1deaa7", 	"#06f43a", 	"#823c59", 	"#e3d94c", 	"#dc1c06",
"#f53b2a", 	"#b46238", 	"#2dfff6", 	"#a82b89", 	"#1a8011", 	"#436a9f", 	"#1a806a",
"#4cf09d", 	"#c188a2", 	"#67eb4b", 	"#b308d3", 	"#fc7e41", 	"#af3101", 	"#ff065",
"#71b1f4", 	"#a2f8a5", 	"#e23dd0", 	"#d3486d", 	"#00f7f9", 	"#474893", 	"#3cec35",
"#1c65cb", 	"#5d1d0c", 	"#2d7d2a", 	"#ff3420", 	"#5cdd87", 	"#a259a4", 	"#e4ac44",
"#1bede6", 	"#8798a4", 	"#d7790f", 	"#b2c24f", 	"#de73c2", 	"#d70a9c", 	"#25b67",
"#88e9b8", 	"#c2b0e2", 	"#86e98f", 	"#ae90e2", 	"#1a806b", 	"#436a9e", 	"#0ec0ff",
"#f812b3", 	"#b17fc9", 	"#8d6c2f", 	"#d3277a", 	"#2ca1ae", 	"#9685eb", 	"#8a96c6",
"#dba2e6", 	"#76fc1b", 	"#608fa4", 	"#20f6ba", 	"#07d7f6", 	"#dce77a", 	"#77ecca"
  ];
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
            keys={(e, i) => { console.log("BarStack e: ", e, i); return keys;}}
            x={getTopics}
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
            <small>{getTopics(tooltipData.bar.data)}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
