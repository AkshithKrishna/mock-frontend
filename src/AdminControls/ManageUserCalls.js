import React from "react";
import config from "../Config/Config"; 

const ManageUserCalls=({userEmail})=>{
    
    const fetchAllUserCalls= async()=>{
        try { 
            setLoading(true);
            let apiUrl = `${config.apiBaseUrl}${config.getMyMockCalls}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error(`Failed to fetch User Calls. Status: ${response.status}, Error: ${errorMessage}`);
                return;
            }

            const data = await response.json();

            console.log('Fetched User Calls: ', data);
            setTempQuestions(data);
        } catch (error) {
            console.error('Error fetching User Calls: ', error.message);
        } finally {
            setLoading(false);
        }
        
    };


    return(
       <div style={{margin:'30px'}}>
        <button style={{margin:'2px'}} onClick={fetchAllUserCalls}>All Users Mock Calls</button>
        {loading && <p>Loading...</p>}
        {tempQuestions.length > 0 && (
            <div>
                <h2 style={{margin:'20px', textAlign:'center'}} >Fetched All User Mock Calls:</h2>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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


export default ManageUserCalls;