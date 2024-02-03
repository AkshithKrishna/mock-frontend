import React, { useState, useEffect } from 'react';
import TextStreamer from './TextStreamSample';
import config from '../Config/Config';

const StartMockCall = (userEmail) => {
  const [callQuestions, setCallQuestions] = useState([]);
  const [selectedTechnology, setSelectedTechnology] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch when the component mounts
    fetchCallQuestions();
  }, []);

  // Function to handle changes in the selected technology
  const handleTechnologyChange = (event) => {
    const newTechnology = event.target.value;
    setSelectedTechnology(newTechnology);
    setLoading(true); // Set loading to true when technology changes
    fetchCallQuestions(newTechnology);
  };

  // Function to fetch questions based on the selected technology
  const fetchCallQuestions = async (technology) => {
    try {
      let apiUrl = config.apiBaseUrl + config.getMainQuestionsCall;

      if (technology) {
        if (technology === "Java FullStack") {
          apiUrl += `?techonology_tags=Java&&techonology_tags=Spring&&techonology_tags=AWS&&techonology_tags=SQL`;
        } else {
          apiUrl += `?techonology_tags=${technology}`;
        }
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error(`Failed to fetch questions. Status: ${response.status}, Error: ${errorMessage}`);
        return;
      }

      const data = await response.json();
      console.log('Fetched Questions: ', data);
      setCallQuestions(data);
      setLoading(false); // Set loading to false when questions are fetched
    } catch (error) {
      console.error('Error fetching questions:', error.message);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  const technologyOptions = ['Java FullStack', 'Data Engineer', 'Java',
    'python',    'AWS',    'Spring',    'React',    'JavaScript',    'HTML',
    'CSS',    'Angular',    'sql-db',    'nosql-db',    'Spark',    'Kafka',
    'Azure',    'CICD',    'SnowFlake',    'Hadoop',    'Airflow',];

  return (
    <div>
      <label style={{ marginLeft: '20px', marginRight: '20px' }} htmlFor="technology">Select Technology:</label>
      <select id="technology" onChange={handleTechnologyChange} value={selectedTechnology}>
        <option value="">Select</option>
        {technologyOptions.map((tech) => (
          <option key={tech} value={tech}>
            {tech}
          </option>
        ))}
      </select>
      <p style={{ marginLeft: '20px', marginRight: '20px', marginBottom: '0px' }}>
        {loading ? 'Loading questions...' : `Questions Available: ${callQuestions.length}`}
      </p>
      <TextStreamer qaList={callQuestions} userEmail={userEmail} />
    </div>
  );
};

export default StartMockCall;
