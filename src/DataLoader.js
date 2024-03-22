import { useEffect, useState } from "react";

export default function DataLoader({
  url, month_year, req_body, setData
}) {
  useEffect(() => {
    const queryDb = () => {
      fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(req_body),
        mode: 'cors'
      })
        .then((resp) => {
          // console.log(`[${url}] Db response: ${resp}`);
          return resp.json();
        })
        .then((res_data) => {
          // console.log(`[${url}] Db response data: ${res_data}`);
          setData(res_data);
        });
    };
    queryDb();
  }, [month_year]);

  return (<></>);
}
