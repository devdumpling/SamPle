import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!data)
      fetch("/api/helloWorld")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setData(data.message);
        });
    else console.log("We got the data!", data);
  }, [data]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;
