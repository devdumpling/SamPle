# SamPle

A quick and dirty React App served from a `Node.js` server for my good pal Samwise Gamgee.

This README serves as a log of how we set this shindig up, organized into steps.

## 1. Initial Setup

```bash
# Create a folder for the project
# This will house our client (React App) and our server (Node.js server)
mkdir SamPle

# Create a git repo for it
git init

# Initialize this package with npm
npm init -y
```

This will create a `package.json` file that we'll use to manage our dependencies and some other fun stuff. Let's take a look at the initial setup.

```JSON
{
  "name": "SamPle",
  "version": "1.0.0",
  "author": "Devon Wells <devon.wellsa@gmail.com>",
  "main": "index.js",
  "license": "MIT"
}
```

## 2. Set up an Express Server

Let's handle the server part of this.

### Create `server`

Make a folder for our server.

```bash
mkdir server && cd server
```

We need to use `Express.js` so we'll want to install it with `npm`. 

```bash
npm i express
```

Now if we take a look at `package.json` again, notice that our project has a dependency. This dependency has been installed in a folder called `node_modules`. Anything we use in our project can reference express now via `node_modules`.

```JSON
{
  "name": "SamPle",
  "version": "1.0.0",
  "main": "index.js",
  "author": "Devon Wells <devon.wellsa@gmail.com>",
  "license": "MIT",
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

Neat!

Next, create a file `index.js` which will run our Express server. Throw this in there.

```js
const express = require("express");

// process.env gives us access to environment variables
// if this were production, we'd want to get the port from there
const PORT = process.env.PORT || 3001;

const app = express();

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
```

One cool thing about `npm` is that we can declare commands that do specific things for us in our `package.json`. We're going to make one such command that starts our server. In `package.json` add the following before `dependencies`

```JSON
"scripts": {
  "start": "node server/index.js"
}
```

Now if you run `npm start` you should see "Listening on Port 3001" in your terminal! Hooray!

### Make an endpoint

So right now our server doesn't really do anything. It opened port 3001... but there's nothing there for it to serve. We need to specify what exactly clients should be able to get when they send a request for port 3001.

As a basic example, let's create a `helloWorld` API endpoint. We can do this by specifying that our server should return some JSON when users request data from `/api/helloWorld`. 

Add the following to `index.js` _above_ the `app.listen` call. 

```js
app.get("/api", (req, res) => {
  res.json({ message: "Hello, World!" });
});
```

Now the magic begins. Navigate to `localhost:3000/api/helloWorld` in a browser and you should see JSON with a message from our server!

Dayuuuuum. Okay, so what next? We can send data... but it would be really great if we could send something bigger. Like a whole fucking app. 


## 3. Create React App

Now we're going to use `create-react-app` to set up the most basic possible React application. You can find out more about `create-react-app` [here](https://reactjs.org/docs/create-a-new-react-app.html). In reality, not every project needs this! In fact, your simple project could probably make do without it.

But my guess is at this point you're more interested in learning than you are about this interview. So in that line of thinking...

From the root directory `/SamPle`:

```bash
create-react-app client
```

Now we'll have a `client` folder in addition to our `server` folder. We'll dig into its contents in a sec. First let's create a proxy in __the client's__ `package.json` that forwards requests to our React app. Add this line to `client/package.json`. 

```JSON
"proxy": "http://localhost:3001",
```

This is basically saying

> Hey! If you get a request that I can't match, send it over to my guy the server, okay?!"

The full `package.json` for the __`client`__ should then look like this:

```json
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.11.4",
    "@testing-library/react": "^11.1.0",
    "@testing-library/user-event": "^12.1.10",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-scripts": "4.0.3",
    "web-vitals": "^1.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "proxy": "http://localhost:3001",
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

Cool, now we can go start the `React` server. 

```bash
cd client && npm start
```

This calls the `start` command from within the `package.json` of `client`, which `create-react-app` bootstrapped for us. 

The important thing is now our server and our react app can talk to each other. 

## 4. Now Kith

Okay, so we have a server on port `3001` with an api that returns some JSON from a `helloWorld` endpoint and we have a react app on port `3000`. 

React can be overwhelming, so let's try to simplify. 

First let's start with the file structure of `client`.

Here are the files:
- README.md self-explanatory
- `node_modules` this is a directory of node dependencies, i.e. what your React app needs to work
- `package.json` a config file that specifies those dependencies and some other details for `npm`
- `public` This is where your public assets live (images, videos, and the `index.html` which roots your entire application). It's important to note that __only files that live in here can be accessed by requests__ to your react application.
- `src` This is where your source code lives. All of the components and React code that you write lives in here.

Within `src` we have a number of files. There are two I'd like to draw your attention to:

- `index.js` this is the "root" of your React application. Notice the `<App />` down there? That's saying, "Hey! Insert the App component and all of their children into the DOM"

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

- `App.js` This is the root _component_. All of your application's children fall underneath this. It is the container for your application. The default looks like this

```js
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

Okay, great, let's fetch from our API using the `fetch` library. 

```js
import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!data)
      fetch("/api/helloWorld")
        .then((res) => res.json())
        .then((data) => setData(data.message));
    else console.log("We got the data:", data);
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
```

Note: I'm not going to dive into the React code here too much. Basically, we have a `useEffect` hook which says "try to get the data if we don't have it" and re-renders anytime `data` changes (which should only be once). As well as a stateful variable `data` setup with a `useState` hook. These are React hook core concepts and are worth diving into on their own. 

Now if you go into `client` and run `npm start` while your server is running in a different terminal, your browser should open with a sweet spinning logo and the response from our server! Neat!

## 5. Next Steps

So let's take that to the next level. We'll add another API endpoint `name-to-caps` that simply capitalizes its input.

```js
const express = require("express");

// process.env gives us access to environment variables
// if this were production, we'd want to get the port from there
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.get("/api/helloWorld", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.post("/api/name-to-caps", (req, res) => {  
  const newName = req.body.name.toUpperCase();
  console.log("WE MADE IT BIG!", newName);
  res.json({ data: newName });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
```

Now let's create a `Form` component to take an input and send it to our backend and manipulate the response. I'm running through this quickly because it's dinner, but...

In `src` create a `components` folder. This isn't necessary, but is standard practice.

Then in `components` create a `Form.jsx` file. Add this into it.

### `Form.jsx`

```jsx
import { useState } from "react";

export const Form = () => {
  const [name, setName] = useState("");
  const [nameCaps, setNameCaps] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/name-to-caps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    });

    if (response) {
      // destructure the response
      const { data } = await response.json();
      setNameCaps(data);
    }
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      <h1>Hello there, {name || "stranger"}</h1>
      <form onSubmit={handleSubmit}>
        {nameCaps ? (
          <h2>THAT'S {nameCaps} IN CAPS</h2>
        ) : (
          <h2>What's your name?</h2>
        )}
        <input type="text" value={name} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
```

Now if you boot your server again and go to the page, you should be able to enter a name and submit. The server then takes that, manipulates it into a capitalized string, and returns it. We then show the updated string. 
