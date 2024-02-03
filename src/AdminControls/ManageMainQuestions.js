import { isDisabled } from "@testing-library/user-event/dist/utils";
import React, { useState, useEffect } from "react";
import config from "../Config/Config";

const QuestionDetailsPopup = ({ question, onClose, onApprove, onDisapprove }) => {
    console.log(question)
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

const ManageMainQuestions = () => {
    const [tempQuestions, setTempQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const fetchQuestions = async () => {
        try { 
            setLoading(true);
            let apiUrl = `${config.apiBaseUrl}${config.getMainQuestionsCall}`;

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

    const handleEdit = (question) => {
        // Implement logic for approving a question
        // FIXME: Implement method for Editing Questions, Answet, Tech
        fetchQuestions();
    };

    const handleReject = async(question) => {
        // FIXME: Reject Question from Main Questions.
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
            <button style={{margin:'2px'}} onClick={fetchQuestions}>Fetch Main Questions</button>
            {loading && <p>Loading...</p>}
            {tempQuestions.length > 0 && (
                <div>
                    <h2 style={{margin:'20px', textAlign:'center'}} >Fetched Main Questions:</h2>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Question</th>
                                <th style={tableHeaderStyle}>Answer</th>
                                <th style={tableHeaderStyle}>Tech_tags</th>
                                <th style={tableHeaderStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tempQuestions.map((question) => (
                                <tr key={question.question_id}>
                                    <td style={tableCellStyle}>{question.question.length > 40? 
                                    `${question.question.slice(0, 40)}....`: question.question}</td>
                                    <td style={tableCellStyle}>{question.answer.length > 56? 
                                    `${question.answer.slice(0, 56)}......`: question.answer}</td>
                                    <td style={tableCellStyle}>{question.technology_tags.join(', ')}</td>
                                    <td style={tableCellStyle}>
                                        <button style={{margin:'2px'}} onClick={() => handleViewDetails(question)}>View</button>
                                        <button disabled={true} style={{ margin: '2px' }} onClick={() => handleEdit(question)}>Edit</button>
                                        <button disabled={true } style={{margin:'2px'}} onClick={() => handleReject(question)}>Reject</button>
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
                    onEdit={handleEdit}
                    onReject={handleReject}
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

export default ManageMainQuestions;
