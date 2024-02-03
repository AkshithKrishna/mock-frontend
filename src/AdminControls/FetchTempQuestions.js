import React, { useState, useEffect } from "react";
import config from "../Config/Config";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const QuestionDetailsPopup = ({ question, onClose, onApprove, onDisapprove }) => {
    return (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'blue', color:'white' }}>
            <h2>Question Details</h2>
            <p><strong>Question:</strong> {question.question}</p>
            <p><strong>Answer:</strong></p>
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
                {question.answer}
            </div>
            <p><strong>Technology Tags:</strong> {question.technology_tags.join(', ')}</p>
            <p><strong>Uploaded by:</strong> {question.uploadedby}</p>
            <p><strong>Uploaded on:</strong> {question.uploadedon}</p>
            <button style={{margin:'2px'}} onClick={onClose}>Close</button>
        </div>
    );
};


const FetchTempQuestions = ({ userEmail }) => {
    const [tempQuestions, setTempQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
     const [selectedQuestion, setSelectedQuestion] = useState(null);

    const fetchQuestions = async () => {
        try { 
            setLoading(true);
            let apiUrl = `${config.apiBaseUrl}${config.fetchTempQuestions}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error(`Failed to fetch questions. Status: ${response.status}, Error: ${errorMessage}`);
                return;
            }

            const data = await response.json();

            console.log('Fetched Questions: ', data);
            setTempQuestions(data);
        } catch (error) {
            console.error('Error fetching questions: ', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch questions when component mounts
        fetchQuestions();
    }, []);

    const handleApprove = async(question) => {
    // Implement logic for approving a question
        const url = `${config.apiBaseUrl}${config.addNewQuestionfromTemp}?questionid=${question.tempquestionid}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                console.log(data); // Output success or error message
            })
            .catch(error => {
                console.error('Error:', error);
            });

        console.log(`Approve question with ID: ${question.tempquestionid}`);
        await delay(1000);
        fetchQuestions();
    };


    const handleDisapprove = async(question) => {
        const url = `${config.apiBaseUrl}${config.deleteTempQuestion}?questionid=${question.tempquestionid}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                console.log(data); // Output success or error message
            })
            .catch(error => {
                console.error('Error:', error);
            });

        console.log(`Disapprove question with ID: ${question.tempquestionid}`);
        await delay(1000);
        fetchQuestions();
    };
    const handleViewDetails = (question) => {
        setSelectedQuestion(question);
    };
    const handleClosePopup = () => {
        setSelectedQuestion(null);
    };

    return (
    <div style={{margin:'30px'}}>
        <button style={{margin:'2px'}} onClick={fetchQuestions}>Fetch Temp Questions</button>
        {loading && <p>Loading...</p>}
        {tempQuestions.length > 0 && (
            <div>
                <h2 style={{margin:'20px', textAlign:'center'}} >Fetched Temp Questions:</h2>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Question ID</th>
                            <th style={tableHeaderStyle}>Question</th>
                            <th style={tableHeaderStyle}>Answer</th>
                            <th style={tableHeaderStyle}>Technology Tags</th>
                            <th style={tableHeaderStyle}>Uploded by</th>
                            <th style={tableHeaderStyle}>Uploded on </th>
                            <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tempQuestions.map((question) => (
                            <tr key={question.question_id}>
                                <td style={tableCellStyle}>{question.tempquestionid}</td>
                                <td style={tableCellStyle}>{question.question}</td>
                                <td style={tableCellStyle}>{question.answer.slice(0,70)}</td>
                                <td style={tableCellStyle}>{question.technology_tags.join(', ')}</td>
                                <td style={tableCellStyle}>{question.uploadedby}</td>
                                <td style={tableCellStyle}>{question.uploadedon}</td>
                                <td style={tableCellStyle}>
                                    <button style={{margin:'2px'}} onClick={() => handleViewDetails(question)}>View</button>
                                    <button style={{ margin: '2px' }} onClick={() => handleApprove(question)}>Approve</button>
                                    <button style={{margin:'2px'}} onClick={() => handleDisapprove(question)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
        {selectedQuestion && (
            <QuestionDetailsPopup
                question={selectedQuestion}
                onClose={handleClosePopup}
                onApprove={handleApprove}
                onDisapprove={handleDisapprove}
            />
        )}
    </div>
);
};

// Define CSS styles
const tableHeaderStyle = {
    border: '1px solid #ddd',
    background:'pink',
    padding: '8px',
    textAlign: 'left',
};

const tableCellStyle = {
    border: '1px solid #ddd',
    background:'white',
    padding: '8px',
};

export default FetchTempQuestions;