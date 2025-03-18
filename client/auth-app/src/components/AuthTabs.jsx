import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthTabs = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={handleTabChange}
      className="mb-3"
      justify
    >
      <Tab eventKey="login" title="Login">
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </Tab>
      <Tab eventKey="signup" title="Sign Up">
        <SignupForm onSignupSuccess={() => setActiveTab('login')} />
      </Tab>
    </Tabs>
  );
};

export default AuthTabs;