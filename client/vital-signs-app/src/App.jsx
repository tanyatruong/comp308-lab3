import React from 'react';
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