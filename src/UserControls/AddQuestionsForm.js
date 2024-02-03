import React, { useState } from 'react';
import config from '../Config/Config';

const AddQuestionsForm = ({ onAddQuestions, userEmail }) => {
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleAddQuestions = async () => {
    let newQuestionObject = {};

    if (newQuestion && newAnswer && selectedTechnologies.length > 0) {
      newQuestionObject = {
        question: newQuestion,
        answer: newAnswer,
        technology_tags: selectedTechnologies,
      };

      try {
        const url = `${config.apiBaseUrl}${config.addTempQuestionsByUser}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: newQuestion,
            answer: newAnswer,
            technology_tags: newQuestionObject.technology_tags,
            uploadedon: new Date().toLocaleTimeString() + " - " + new Date().toLocaleDateString(),
            uploadedby: userEmail,
          }),
        });

        if (response.ok) {
          console.log('Question added successfully.');
          onAddQuestions(newQuestionObject);
          setNewQuestion('');
          setNewAnswer('');
          setSelectedTechnologies([]);
          setConfirmationMessage('Question added successfully!');
          setTimeout(() => setConfirmationMessage(''), 3000);
        } else {
          console.error('Failed to add question. Status:', response.status);
        }
      } catch (error) {
        console.error('Error adding question:', error.message);
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleTechnologyChange = (technology) => {
    setSelectedTechnologies((prevSelected) => {
      return prevSelected.includes(technology) ? prevSelected.filter((tech) => tech !== technology) : [...prevSelected, technology];
    });
  };

  const technologyOptions = [
    'Java',
    'python',
    'AWS',
    'Spring',
    'React',
    'JavaScript',
    'HTML',
    'CSS',
    'Angular',
    'sql-db',
    'nosql-db',
    'Spark',
    'Kafka',
    'Azure',
    'CICD',
    'SnowFlake',
    'Hadoop',
    'Airflow',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {confirmationMessage && <div style={{ marginTop: '10px', color: 'black' }}>{confirmationMessage}</div>}
      <label>
        Question:
        <textarea style={{ margin: '10px' }} value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} rows={3} cols={80} />
      </label>
      <label style={{}}>
        Answer:
        <textarea style={{ margin: '10px' }} value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} rows={8} cols={80} />
      </label>
      <label style={{ margin: '10px', display: 'flex' }}>
        Technology:
        {technologyOptions.map((tech) => (
          <div key={tech} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              id={tech}
              value={tech}
              checked={selectedTechnologies.includes(tech)}
              onChange={() => handleTechnologyChange(tech)}
            />
            <label htmlFor={tech}>{tech}</label>
          </div>
        ))}
      </label>

      <button type="button" onClick={handleAddQuestions}>
        Add Questions
      </button>
    </div>
  );
};

export default AddQuestionsForm;
