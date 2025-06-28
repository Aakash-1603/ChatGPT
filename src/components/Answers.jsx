import { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { CheckHeading } from "./Helper";
import { ReplceHeading } from "./Helper";

const Answers = ({ ans, totalres, index }) => {
  const [heading, setheading] = useState(false);
  const [answer, setanswer] = useState(ans);

  useEffect(() => {
    if (CheckHeading(ans)) {
      setheading(true);
      setanswer(ReplceHeading(ans));
    } else {
      setheading(false);
      setanswer(ans);
    }
  }, [ans]);

  useEffect(() => {
    Prism.highlightAll();
  }, [answer]);

  // Enhanced code block parser: supports ```lang\ncode...```
  function renderAnswerParts(text) {
    if (typeof text !== "string") return <span>{text}</span>;
    const parts = [];
    // Regex: match ```lang\ncode...```
    const regex = /```([a-zA-Z0-9]*)\s*([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(text))) {
      if (match.index > lastIndex) {
        const normalText = text.slice(lastIndex, match.index).trim();
        if (normalText)
          parts.push(
            <p
              key={key++}
              className="mb-2 text-base text-white whitespace-pre-line"
            >
              {normalText}
            </p>
          );
      }
      const lang = match[1]?.trim() || "javascript";
      const code = match[2].trim();
      if (code)
        parts.push(
          <div key={key++} className="my-2">
            {lang && (
              <div className="text-xs text-green-400 font-mono mb-1 ml-1 select-none">
                {lang}
              </div>
            )}
            <pre className="rounded-lg p-3 overflow-x-auto text-xs md:text-sm border border-green-400 bg-zinc-900">
              <code className={`language-${lang}`}>{code}</code>
            </pre>
          </div>
        );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      const normalText = text.slice(lastIndex).trim();
      if (normalText)
        parts.push(
          <p
            key={key++}
            className="mb-2 text-base text-white whitespace-pre-line"
          >
            {normalText}
          </p>
        );
    }
    if (parts.length === 1 && parts[0].type === "div") return parts[0];
    if (parts.length === 1 && parts[0].type === "p") return parts[0];
    return parts;
  }

  return (
    <>
      {index == 0 && totalres > 1 ? (
        <>{renderAnswerParts(answer)}</>
      ) : heading ? (
        <>{renderAnswerParts(answer)}</>
      ) : (
        <>{renderAnswerParts(answer)}</>
      )}
    </>
  );
};

export default Answers;
