import React, { useState } from "react";
import { URL } from "./constants";
import "./App.css";

function App() {
  const [question, setquestion] = useState("");
  const [answer, setanswer] = useState(undefined);

  const payload = {
    contents: [
      {
        parts: [
          {
            text: question,
          },
        ],
      },
    ],
  };

  const askquestion = async () => {
    let res = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    res = await res.json();

    console.log(res.candidates[0].content.parts[0].text);
    setanswer(res.candidates[0].content.parts[0].text);
    setquestion("");
  };
  return (
    <>
      <div className="grid grid-cols-5 h-screen">
        <div className="col-span-1 bg-zinc-700 text-center"></div>
        <div className="col-span-4 flex flex-col h-screen">
          <div className="flex-1 overflow-y-auto text-center container">
            <div className="flex justify-center text-white p-10">{answer}</div>
          </div>
          <div className="flex justify-between items-center bg-zinc-700 p-4 w-1/2 text-white m-auto rounded-4xl border-zinc-600 border mb-10">
            <input
              type="text"
              placeholder="Ask me anything"
              className="w-full h-full p-2 outline-none"
              value={question}
              onChange={(e) => setquestion(e.target.value)}
            />
            <button
              className="bg-zinc-500 text-white px-4 py-2 rounded-4xl"
              onClick={askquestion}
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
