import {useState, useEffect} from 'react';

function DbQuery() {
  const [text, setText] = useState([]);
  const [query, setQuery] = useState([]);

  useEffect(() => {
    console.log("Get results for query: ", query);
    const queryDb = () => {
      const API = 'http://127.0.0.1:3001/api/q';
      fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'query': query,
        }),
        mode: 'cors'
      })
        .then((resp) => {
          console.log("Db response: ", resp);
          return resp.json();
        })
        .then((data) => {
          console.log("query res: ", data);
        });
    };
    if (query.length !== 0) {
      queryDb();
    }
  }, [query]);

  function handleTextAreaChange(ev) {
    setText(ev.target.value);
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    let q = ev.target.dbQuery.value;
    if (q.length !== 0) {
      console.log(q);
      setQuery(q);
    }
    ev.target.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Db query string:
        <textarea value="" name="dbQuery"
          value={text} onChange={handleTextAreaChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default DbQuery;
