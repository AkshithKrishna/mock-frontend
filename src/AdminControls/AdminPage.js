import React, { useState } from "react";
import FetchTempQuestions from "./FetchTempQuestions";
import ManageMainQuestions from "./ManageMainQuestions";

const AdminPage = ({ userEmail }) => {
  const [mode, setMode] = useState('fetchTempQuestions');

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const isAllowedUser = userEmail === 'siva.sotc@gmail.com' || userEmail === 'smaru@gmail.com';

  return (
    <div style={{ margin: '20px' }}>
      <h1 style={{ backgroundColor: '#33FF', color: 'white', textAlign: 'center', padding: '5px' }}> Admin Portal</h1>
      <div>
        {isAllowedUser && (
          <>
            <button style={{ margin: '2px' }} onClick={() => handleModeChange('fetchTempQuestions')}>
              Manage Temp Questions
            </button>
            <button style={{ margin: '2px' }} onClick={() => handleModeChange('manageQuestions')}>
              Manage Main Questions
            </button>
            <button style={{ margin: '2px' }} onClick={() => handleModeChange('manageUserCalls')}>
              Manage User Calls
            </button>
          </>
        )}
      </div>
      {mode === 'fetchTempQuestions' && <FetchTempQuestions userEmail={userEmail} />}
      {mode === 'manageQuestions' && <ManageMainQuestions />}
    </div>
  );
};

export default AdminPage;
