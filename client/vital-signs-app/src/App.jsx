import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import VitalSignsList from './components/VitalSignsList';
import VitalSignsForm from './components/VitalSignsForm';
import VitalSignsDetail from './components/VitalSignsDetail';
import './App.css';

// Create Apollo client specifically for vital signs
const client = new ApolloClient({
  uri: 'http://localhost:4002/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
});

function App({ user }) {
  useEffect(() => {
    // Handle login event - reset cache when user logs in
    const handleLoginSuccess = () => {
      console.log('Login detected in vital-signs-app, resetting Apollo cache');
      client.resetStore();
    };
    
    // Handle logout event - clear cache without refetching queries
    const handleLogoutSuccess = () => {
      console.log('Logout detected in vital-signs-app, clearing Apollo cache');
      client.clearStore(); // Use clearStore instead of resetStore
    };
    
    // Add event listeners
    window.addEventListener('login-success', handleLoginSuccess);
    window.addEventListener('logout-success', handleLogoutSuccess);
    
    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('login-success', handleLoginSuccess);
      window.removeEventListener('logout-success', handleLogoutSuccess);
    };
  }, []);
  
  return (
    <ApolloProvider client={client}>
      <div className="vital-signs-container">
        <Routes>
          <Route path="/" element={<VitalSignsList user={user} />} />
          <Route path="/new" element={<VitalSignsForm user={user} />} />
          <Route path="/edit/:id" element={<VitalSignsForm user={user} />} />
          <Route path="/view/:id" element={<VitalSignsDetail user={user} />} />
        </Routes>
      </div>
    </ApolloProvider>
  );
}

export default App;