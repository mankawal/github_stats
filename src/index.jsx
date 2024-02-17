import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import {Route, Routes} from 'react-router-dom';

import TemperatureBarStack from "./TopicRepoStack";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <TemperatureBarStack/>
    </BrowserRouter>
  </React.StrictMode>
);

/*
ReactDOM.render(
    {({width, height}) => (
    )},
    document.getElementById("root")
);
*/
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
