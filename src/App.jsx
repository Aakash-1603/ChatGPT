import React, { useState, useEffect } from "react";
import { URL } from "./constants";
import "./App.css";
import Answers from "./components/Answers";

function App() {
  const [question, setquestion] = useState("");
  const [answer, setanswer] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("chatgpt_dark_mode");
    return stored ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem("chatgpt_dark_mode", JSON.stringify(darkMode));
  }, [darkMode]);

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

  const startNewChat = () => {
    setChats([...chats, []]);
    setCurrentChatIndex(chats.length);
    setanswer([]);
  };

  const askquestion = async () => {
    let res = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    res = await res.json();

    let dataString = res.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ");
    dataString = dataString.map((item) => item.trim()).filter((item) => item);
    const newAnswer = [
      ...(answer || []),
      { type: "q", text: question },
      { type: "a", text: dataString },
    ];
    setanswer(newAnswer);
    const updatedChats = [...chats];
    updatedChats[currentChatIndex] = newAnswer;
    setChats(updatedChats);
    setquestion("");
  };

  useEffect(() => {
    const storedChats = localStorage.getItem("chatgpt_chats");
    const storedIndex = localStorage.getItem("chatgpt_current_index");
    let parsedChats = [[]];
    let idx = 0;
    if (storedChats) {
      try {
        parsedChats = JSON.parse(storedChats);
        if (!Array.isArray(parsedChats) || parsedChats.length === 0) {
          parsedChats = [[]];
        }
      } catch {
        parsedChats = [[]];
      }
    }
    if (storedIndex) {
      idx = parseInt(storedIndex, 10);
      if (isNaN(idx) || idx < 0 || idx >= parsedChats.length) {
        idx = 0;
      }
    }
    setChats(parsedChats);
    setCurrentChatIndex(idx);
    setanswer(parsedChats[idx] || []);
  }, []);

  useEffect(() => {
    if (Array.isArray(chats) && chats.length > 0) {
      localStorage.setItem("chatgpt_chats", JSON.stringify(chats));
      localStorage.setItem("chatgpt_current_index", currentChatIndex);
    }
  }, [chats, currentChatIndex]);

  return (
    <div className={darkMode ? "dark" : "light"}>
      <div
        className={`grid grid-cols-1 md:grid-cols-5 h-screen ${
          darkMode ? "bg-zinc-800" : "bg-zinc-100"
        }`}
      >
        <div
          className={`col-span-1 md:col-span-1 text-center flex flex-col items-center py-4 md:py-6 px-1 md:px-2 border-r md:overflow-y-auto overflow-y-visible ${
            darkMode
              ? "bg-zinc-900 border-zinc-800"
              : "bg-zinc-200 border-zinc-300"
          }`}
          style={{ minWidth: 0 }}
        >
          <div className="mb-6 md:mb-8 w-full flex justify-center">
            <span
              className={`text-xl md:text-2xl font-bold select-none ${
                darkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              ChatGPT
            </span>
          </div>
          <button
            className={`mb-4 md:mb-6 px-3 md:px-4 py-2 rounded-full font-semibold shadow transition-all ${
              darkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={startNewChat}
          >
            + New Chat
          </button>
          <div className="flex flex-col gap-2 w-full flex-1 overflow-y-auto pb-20 md:pb-24 scrollbar-hide">
            {chats.map((chat, idx) => (
              <div key={idx} className="relative w-full">
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg border truncate transition-all ${
                    idx === currentChatIndex
                      ? darkMode
                        ? "border-blue-500 bg-zinc-700 text-white border-2"
                        : "border-blue-400 bg-zinc-100 text-blue-700 border-2"
                      : darkMode
                      ? "border-zinc-800 bg-zinc-800 text-white hover:bg-zinc-700"
                      : "border-zinc-300 bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                  }`}
                  onClick={() => {
                    setCurrentChatIndex(idx);
                    setanswer(chat);
                    localStorage.setItem("chatgpt_current_index", idx);
                  }}
                  style={{
                    paddingRight: chats.length > 1 ? "2.5rem" : undefined,
                  }}
                >
                  {chat && chat.length > 0
                    ? chat
                        .find((item) => item.type === "q")
                        ?.text?.slice(0, 30) || "Chat"
                    : "Empty Chat"}
                </button>
                {chats.length > 1 && (
                  <button
                    className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full shadow transition-colors border focus:outline-none focus:ring-2 ${
                      darkMode
                        ? "bg-red-500 hover:bg-red-600 text-white border-zinc-800 focus:ring-red-400"
                        : "bg-red-400 hover:bg-red-500 text-white border-zinc-300 focus:ring-red-300"
                    }`}
                    title="Delete chat"
                    onClick={(e) => {
                      e.stopPropagation();
                      let newChats = chats.filter((_, i) => i !== idx);
                      if (newChats.length === 0) {
                        newChats = [[]];
                      }
                      let newIndex = currentChatIndex;
                      if (idx === currentChatIndex) {
                        newIndex = idx === 0 ? 0 : idx - 1;
                      } else if (idx < currentChatIndex) {
                        newIndex = currentChatIndex - 1;
                      }
                      if (newIndex >= newChats.length)
                        newIndex = newChats.length - 1;
                      setChats(newChats);
                      setCurrentChatIndex(newIndex);
                      setanswer(newChats[newIndex] || []);
                      localStorage.setItem(
                        "chatgpt_chats",
                        JSON.stringify(newChats)
                      );
                      localStorage.setItem("chatgpt_current_index", newIndex);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            className={`mb-2 px-4 py-2 rounded-full font-semibold shadow border transition-all flex items-center gap-2 ${
              darkMode
                ? "bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700"
                : "bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200"
            }`}
            onClick={() => setDarkMode((prev) => !prev)}
            style={{ position: "relative", bottom: 0, marginTop: "auto" }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.05l-.71-.71M12 7a5 5 0 100 10 5 5 0 000-10z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                />
              </svg>
            )}
            {darkMode ? "Dark" : "Light"} Mode
          </button>
        </div>
        <div
          className={`col-span-1 md:col-span-4 flex flex-col h-[60vh] md:h-screen ${
            darkMode ? "bg-zinc-800" : "bg-zinc-50"
          }`}
        >
          <div className="flex-1 overflow-y-auto text-center container pt-6 md:pt-10 scrollbar-hide px-1 md:px-0">
            <ul>
              {(() => {
                const groups = [];
                for (let i = 0; i < answer.length; i++) {
                  if (
                    answer[i].type === "q" &&
                    answer[i + 1] &&
                    answer[i + 1].type === "a"
                  ) {
                    groups.push(
                      <li key={`group-${i}`} className="mb-8 list-none">
                        <div className="flex justify-end mr-6">
                          <div
                            className={`text-right ${
                              darkMode
                                ? "text-white bg-zinc-900 border-zinc-700"
                                : "text-zinc-800 bg-zinc-100 border-zinc-300"
                            } border-4 mb-2 px-7 py-4 min-w-[120px] max-w-[80%] w-fit shadow-2xl rounded-[2.5rem] rounded-br-[3rem] rounded-tl-[3rem] ring-2 ${
                              darkMode
                                ? "ring-zinc-700/30 ring-offset-2 ring-offset-zinc-800"
                                : "ring-zinc-300/30 ring-offset-2 ring-offset-zinc-100"
                            } transition-all duration-300`}
                          >
                            <Answers ans={answer[i].text} index={0} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-2 ml-6">
                          <div
                            className={`text-left ${
                              darkMode
                                ? "text-white bg-zinc-900 border-zinc-700"
                                : "text-zinc-800 bg-zinc-100 border-zinc-300"
                            } border-4 px-7 py-4 min-w-[120px] max-w-[80%] w-fit shadow-2xl rounded-[2.5rem] rounded-bl-[3rem] rounded-tr-[3rem] mb-1 ring-2 ${
                              darkMode
                                ? "ring-zinc-700/30 ring-offset-2 ring-offset-zinc-800"
                                : "ring-zinc-300/30 ring-offset-2 ring-offset-zinc-100"
                            } transition-all duration-300`}
                          >
                            {answer[i + 1].text.map((ansItem, ansIndex) => (
                              <Answers
                                ans={
                                  Array.isArray(ansItem)
                                    ? ansItem.join("\n")
                                    : ansItem
                                }
                                index={ansIndex}
                                key={`a-${i + 1}-${ansIndex}`}
                              />
                            ))}
                          </div>
                        </div>
                      </li>
                    );
                    i++;
                  }
                }
                return groups;
              })()}
            </ul>
          </div>
          <div
            className={`flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center p-2 md:p-4 w-full md:w-1/2 m-auto rounded-3xl md:rounded-4xl border mb-6 md:mb-10 ${
              darkMode
                ? "bg-zinc-900 text-white border-zinc-700"
                : "bg-zinc-100 text-zinc-800 border-zinc-300"
            }`}
            style={{ maxWidth: "100vw" }}
          >
            <input
              id="chat-input"
              name="chat-input"
              type="text"
              placeholder="Ask me anything"
              className="w-full h-full p-2 outline-none text-base md:text-lg bg-transparent"
              value={question}
              onChange={(e) => setquestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && question.trim()) {
                  askquestion();
                }
              }}
              style={{ minWidth: 0 }}
            />
            <button
              className={`group px-4 py-2 rounded-full font-semibold shadow-md border flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 relative bg-transparent mt-2 md:mt-0 ${
                darkMode
                  ? "text-white border-zinc-700 hover:bg-zinc-800/10 hover:shadow-lg focus:ring-blue-400"
                  : "text-zinc-700 border-zinc-300 hover:bg-zinc-200/60 hover:shadow focus:ring-blue-300"
              }`}
              style={{ borderRadius: "9999px" }}
              onClick={askquestion}
              aria-label="Send"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke={darkMode ? "white" : "#334155"}
                  className="w-5 h-5 rotate-45"
                >
                  <path d="M3 10.5l7.5 2.5L21 3l-9 18-2.5-7.5L3 10.5zm0 0L21 3m-18 7.5l7.5 2.5L21 3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
