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
