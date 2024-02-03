import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import "bootstrap/dist/css/bootstrap.min.css";
import LoaderComp from "./LoaderComp";
import TextEditorAnswer from "./TextEditorAnswer";
import config from "../Config/Config";

const speaker = "Me";
let currentQAIndex = 0;
let recordSTime = null;
let recordETime = null;
let aksedQuestionsList = [];
const loadmessage = "Saving MockCall. Please wait...";

const TextStreamer = ({ qaList, userEmail }) => {
  const [displayedAnswers, setDisplayedAnswers] = useState([]);
  const [askedQuestions, setAskedQuestions] = useState([null]);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const containerRef = useRef(null);
  const [callStarted, setCallStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(userEmail);

  useEffect(() => {
    // Check if the SpeechSynthesis API is available
    if ("speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    if (startTime && endTime) {
      const callTime = subFinalTime(startTime, endTime);
      insertStudentRecord(
        speaker,
        userEmail,
        recordSTime,
        recordETime,
        callTime
      );
      setTotalTime(callTime); // Update totalTime state
      console.log("Asked Question No: " + aksedQuestionsList);
    }
  }, [startTime, endTime]);

  const playQA = async () => {
    if (currentQAIndex < qaList.length) {
      if (currentQAIndex === 0) {
        setDisplayedAnswers([]);
        setAskedQuestions([]);
        const confirmation = window.confirm(
          "Do you want to listen to instructions before starting the Mock Call?",
          "Yes",
          "No"
        );
        if (confirmation) {
          await instructionsSpeak(qaList.length);
        }
        const conf2 = window.confirm("Start the Mock Call Now?", "Yes", "No");
        if (!conf2) {
          return;
        }
        const cdate = new Date();
        setStartTime(cdate); // Store start time as a Date object
        recordSTime = cdate.toLocaleTimeString();
        console.log(recordSTime);
        setCallStarted(true);
        setTotalTime("Call not yet Finished");
        speakText(`Starting Mock Call, Question 1.`);
      }
      const currentQA = qaList[currentQAIndex];
      //console.log(currentQA.question_id)
      aksedQuestionsList.push(currentQA.question_id);

      // Play the question
      //speakText(`${currentQA.question}`);

      // Introduce a shorter delay to speak the question
      //await delay(5000); // FIXME: we need to fix this one based on question length

      console.log(currentQA.question);

      console.log(currentQA.answer);
      const questionUtterance = new SpeechSynthesisUtterance(
        currentQA.question
      );
      ///dymanic delay to complete question speech
      await new Promise((resolve) => {
        questionUtterance.onend = resolve;
        speechSynthesis.speak(questionUtterance);
      });

      // Display the entire answer at once
      setDisplayedAnswers((prevAnswers) => [
        ...prevAnswers,
        { speaker, timestamp: new Date(), answer: currentQA.answer },
      ]);

      const wordsArray = currentQA.answer.split(" ");
      // Introduce a shorter delay before clearing the displayed text
      await delay(500 * wordsArray.length);

      await delay(10000); // Delay before start speaking of next question.

      if (currentQAIndex + 1 !== qaList.length) {
        // Move to the next question
        speakText(`Next Question.`);

        // Notify the parent component that the current question has been played
      }

      if (currentQAIndex + 1 === qaList.length) {
        let tm2 = new Date();
        setEndTime(tm2); // Store end time as a Date object
        recordETime = tm2.toLocaleTimeString();

        speakText(
          `Congratulations. The Mock Interview is Completed. This call will be recorded and available in your myCalls Histoty.`
        );
        await delay(10000);
        currentQAIndex = currentQAIndex + 2;
        //insertStudentRecord(speaker, userEmail, recordSTime, recordETime, totalTime);
      }
      currentQAIndex = currentQAIndex + 1;
      playQA();
    }
  };

  const insertStudentRecord = async (stName, stEmail, sTime, eTime, tTime) => {
    setLoading(true);
    const datet = new Date().toISOString().split("T")[0]; // Get the current date in 'YYYY-MM-DD' format
    try {
      const response = await fetch(
        `${config.apiBaseUrl}${config.recordMockCall}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_name: stName,
            student_email: stEmail,
            date: datet,
            start_time: sTime,
            end_time: eTime, // Corrected property name
            total_time: tTime,
          }),
        }
      );

      if (response.ok) {
        console.log("Student record inserted successfully.");
      } else {
        console.error("Failed to insert student record.");
      }
    } catch (error) {
      console.error("Error inserting student record:", error);
    }
    setLoading(false);
  };

  const subFinalTime = (startTime, endTime) => {
    const startSeconds =
      startTime.getHours() * 3600 +
      startTime.getMinutes() * 60 +
      startTime.getSeconds();
    const endSeconds =
      endTime.getHours() * 3600 +
      endTime.getMinutes() * 60 +
      endTime.getSeconds();
    const totalTimeInSeconds = endSeconds - startSeconds;

    const hours = Math.floor(totalTimeInSeconds / 3600);
    const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
    const seconds = Math.floor(totalTimeInSeconds % 60);

    return `${hours}:${minutes}:${seconds}`;
  };

  const instructionsSpeak = async (n) => {
    speakText(` Instructions: In this mock call, you will have ${n} questions. 
    Each question will begin with the keyword question, 
    followed by the actual question. The answer will then be displayed 
    on the screen word by word. After the answer display completes, 
    there will be a 10-second gap before the next question begins. 
    Once all questions are completed, you will be informed. 
    Please proceed accordingly.`);
    await delay(30000);
  };

  const speakText = (text) => {
    // Set the text and speak it using text-to-speech
    if (speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const resetCancelMockCall = async () => {
    // FIXME: Hot Reloading
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    window.location.reload();
    return;
  };

  useEffect(() => {
    // Scroll to the bottom of the container for each new line in the answer
    if (containerRef.current) {
      const lineHeight = 20; // Adjust this value based on your design
      containerRef.current.scrollTop += lineHeight;
    }
  }, [displayedAnswers]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          style={{
            marginLeft: "20px",
            marginTop: "5px",
            padding: "5px",
            width: "150px",
            marginRight: "20px",
            background: "blue",
            color: "yellow",
          }}
          onClick={playQA}
          disabled={currentQAIndex >= qaList.length || callStarted}
        >
          <strong>Start MockCall</strong>
        </button>
        <button
          style={{
            marginTop: "5px",
            marginRight: "20px",
            padding: "5px",
            width: "180px",
            background: "orange",
            color: "white",
          }}
          onClick={resetCancelMockCall}
          type="button"
        >
          Cancel/Reset MockCall
        </button>

        <div
          style={{
            border: "1px solid #ccc",
            color: "red",
            padding: "2px",
            marginLeft: "30px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            alignSelf: "center",
          }}
        >
          <strong style={{ color: "blue" }}>Start Time:</strong>{" "}
          {startTime?.toLocaleTimeString()}
          <strong style={{ color: "green" }}> End Time:</strong>{" "}
          {endTime?.toLocaleTimeString()}
          <br></br>
          <strong style={{ color: "purple" }}>
            {" "}
            Total Mock Call Time:
          </strong>{" "}
          {totalTime}
        </div>
      </div>
      <strong
        style={{
          alignContent: "center",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        {!callStarted && (
          <>
            If you complete a mock call, the call record will be available until
            you refresh the page or until Cancel Reset Mock call. You are unable
            to start a new call without resetting existing call.
          </>
        )}
      </strong>
      {loading ? <LoaderComp message={loadmessage} /> : null}
      <Draggable>
        <div
          className="container mt-5 p-3 border bg-light"
          style={{ maxHeight: "200px", overflowY: "auto" }}
          ref={containerRef}
        >
          {displayedAnswers.map((answer, index) => (
            <div key={index} className="d-flex flex-column mb-3">
              <div className="d-flex justify-content-between">
                <p>
                  <strong>{answer.speaker}:</strong>{" "}
                  {answer.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <p>
                <TextEditorAnswer answerPassed={answer.answer} />{" "}
              </p>
            </div>
          ))}
        </div>
      </Draggable>
    </div>
  );
};

export default TextStreamer;
