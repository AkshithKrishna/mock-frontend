import React, { useState, useEffect } from "react";

const TextEditorAnswer = ({ answerPassed }) => {
  const [words, setWords] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const wordsArray = answerPassed.split(" ");

    const intervalId = setInterval(() => {
      if (counter < wordsArray.length) {
        setWords((prevWords) => [...prevWords, wordsArray[counter]]);
        setCounter((prevCounter) => prevCounter + 1);
      } else {
        clearInterval(intervalId);
      }
    }, 400);

    return () => {
      // Clear the interval when the component unmounts
      clearInterval(intervalId);
    };
  }, [answerPassed, counter]);

  return (
    <div>
      {words.map((word, index) => (
        <span key={index}>
          {word}{' '}
        </span>
      ))}
    </div>
  );
};

export default TextEditorAnswer;
