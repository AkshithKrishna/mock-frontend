  import React, { useState, useEffect } from 'react';
  import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
  import { Amplify, Auth } from 'aws-amplify';
  import { withAuthenticator } from '@aws-amplify/ui-react';
  import Questions from './UserControls/Questions';
  import StartMockCall from './UserControls/StartMockCall';
  import '@aws-amplify/ui-react/styles.css';
  import config from './Config/amplifyconfiguration.json';
  import MyMockCalls from './UserControls/MyMockCalls';
  import AdminPage from './AdminControls/AdminPage';

  Amplify.configure(config);

  function App({ signOut, user }) {
    // Mock Calls State and Functions
    const [mockCalls, setMockCalls] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [showUserProfile, setShowUserProfile] = useState(false);


    useEffect(() => {
      console.log('User changed:', user);
      console.log('User Email: ' + user.attributes.email);
      setUserEmail(user.attributes.email);

      // Fetch the authentication token
      Auth.currentSession()
        .then((session) => {
          const token = session.getIdToken().getJwtToken();
          setAuthToken(token);
        })
        .catch((error) => console.error('Error fetching token:', error));
    }, [user]);

    return (
      <Router>
        <div style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(https://st2.depositphotos.com/4413287/43248/i/450/depositphotos_432488430-stock-photo-abstract-simple-background-copy-space.jpg)', backgroundSize: 'cover', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#333', color: 'white'}}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ marginLeft: '20px', textAlign: 'center', alignContent: 'center' }}>Mock Speak</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '20px', position: 'relative' }}>
              <span style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => setShowUserProfile(!showUserProfile)}>👨</span>
              {showUserProfile && (
                <div style={{ position: 'absolute', top: '100%', right: 0, background: '#333', color: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0,0,0,0.3)' }}>
                  <span style={{ color: 'yellow' }}>User: {userEmail}</span>
                  <button style={{ backgroundColor: 'green', color: 'white', marginTop: '5px' }} onClick={signOut}>Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/">
              <button style={{ backgroundColor: 'green', color: 'white', width: '100px', height: '40px', margin: '20px' }}>Home</button>
            </Link>
            <Link to="/mockcall">
              <button style={{ backgroundColor: 'pink', color: 'white', width: '100px', height: '40px', margin: '20px' }}>Mock Call</button>
            </Link>
            <Link to="/questions">
              <button style={{ backgroundColor: 'orange', color: 'white', width: '100px', height: '40px', margin: '20px' }}>Questions</button>
            </Link>
            <Link to="/mycalls">
              <button style={{ backgroundColor: 'white', color: 'black', width: '100px', height: '40px', margin: '20px' }}>My Calls</button>
            </Link>
            {(userEmail === 'siva.sotc@gmail.com' || userEmail === 'smarupudi@moxieit.com') && (
              <Link to="/admin">
                <button style={{ backgroundColor: 'blue', color: 'white', width: '100px', height: '40px', margin: '20px' }}>Admin</button>
              </Link>
            )}

          </div>          

          <Switch>
            <Route path="/mockcall">
              <StartMockCall userEmail={userEmail} />
            </Route>
            <Route path="/questions">
              <Questions  userEmail={userEmail}/>
            </Route>
            <Route path="/mycalls">
              <MyMockCalls userEmail={userEmail} />
            </Route>
            <Route path="/admin">
              {(userEmail === 'siva.sotc@gmail.com' || userEmail === 'smarupudi@moxieit.com')?<AdminPage userEmail={userEmail}/>: <h1 style={{textAlign:'center'}}> You don't have access to this page. Please Contact Admin.</h1>}
            </Route>
            <Route path="/">
              <h2 style={{ textAlign: 'center', animation: 'moveText 10s infinite' }}>Welcome to the home page!</h2>
              <h4 style={{ alignSelf: 'center' }}> What this site is for:</h4>
              <ul style={{ alignSelf: 'center' }}>
                <li>View List of Mock Calls taken </li>
                <li>Take a Mock Call</li>
                <li>Contribute Questions</li>
              </ul>
              <div style={{alignSelf: 'center'}}>
                <h4>Technologies Used to Develop this site</h4>
                <li>React - ui-react, user-events, aws-amplify, bootstrap, cors, date-picker, dom, draggeble, loader-spinner, router-dom, linting</li>
                <li>AWS - Amplify, Cognito, RDS, Lambda, API Gateway</li>
                <li>Spring - Monolithic</li>
                {console.log(authToken)}
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
      
    );
  }

  export default withAuthenticator(App);