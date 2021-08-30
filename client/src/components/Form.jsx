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
