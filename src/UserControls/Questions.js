import React, { useState } from 'react';
import AddQuestionsForm from './AddQuestionsForm';

const Questions = ({ userEmail }) => {
  const [mode, setMode] = useState('add'); // 'fetch' or 'add'

  console.log("Email From Questions: " + userEmail)

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleAddQuestions = (newQuestionObject) => {
    // Your logic to handle the new question object
    console.log('New question added:', newQuestionObject);
    // You can update the state or perform other actions here
  };

  return (
    <div>
      <h2 style={{ marginLeft: '20px' }}>Willing to Contribute Questions? </h2>
      <form>
        <button style={{ marginLeft: '20px' }} type="button" onClick={() => handleModeChange('add')}>
          Add Questions
        </button>
        <button style={{ marginLeft: '10px' }} type="button" onClick={() => handleModeChange('bulk')} >
          Add Bulk Questions
        </button>
      </form>
      {mode === 'add' ? (
        <AddQuestionsForm onAddQuestions={handleAddQuestions} userEmail={userEmail} />
      ) : (
        <h4 style={{textAlign:'center'}}>Coming Soon...</h4>
      )}
    </div>
  );
};

export default Questions;
