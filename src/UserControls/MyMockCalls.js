import React, { useEffect, useState } from "react";
import config from "../Config/Config";

const MyMockCalls = ({ userEmail }) => {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    const fetchMockCalls = async () => {
      try {
        const callsURL = `${config.apiBaseUrl}${config.getMyMockCalls}?userEmail='${userEmail}'`;
        const response = await fetch(callsURL);

        if (!response.ok) {
          console.log("Unable to fetch the Mock Calls");
          return;
        }

        const callsData = await response.json();
        setCalls(callsData);
        //console.log(callsData);
      } catch (error) {
        console.error("Error in Displaying Calls", error);
      }
    };

    fetchMockCalls();
  }, [userEmail]);  // Include userEmail in the dependencies array

  return (
    <div style={{ margin: "20px" }}>
      <h2 >My Mock Calls({userEmail}) </h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Start Time</th>
            <th style={tableHeaderStyle}>End Time</th>
            <th style={tableHeaderStyle}>Total Time</th>
            <th style={tableHeaderStyle}>View Questions</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>{call.date}</td>
              <td style={tableCellStyle}>{call.start_time}</td>
              <td style={tableCellStyle}>{call.end_time}</td>
              <td style={tableCellStyle}>{call.total_time}</td>
              <td style={tableCellStyle}>Coming soon...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle = {
  backgroundColor: "aqua",
  padding: "10px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  margin:'20px',
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid black",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  backgroundColor:'white',
  margin:'20px',
};


export default MyMockCalls;
