import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Import micro frontends
const AuthApp = lazy(() => import('../../auth-app/src/App'));
const VitalSignsApp = lazy(() => import('../../vital-signs-app/src/App'));

// GraphQL query to check authentication status
const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      username
      email
    }
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { loading, data, refetch } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    // Listen for login events from Auth app
    const handleLoginSuccess = () => {
      refetch();
    };

    window.addEventListener('login-success', handleLoginSuccess);
    window.addEventListener('logout-success', () => {
      setIsLoggedIn(false);
    });

    return () => {
      window.removeEventListener('login-success', handleLoginSuccess);
      window.removeEventListener('logout-success', () => {
        setIsLoggedIn(false);
      });
    };
  }, [refetch]);

  useEffect(() => {
    if (data?.currentUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [data]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} user={data?.currentUser} />
      <Container className="mt-4">
        <Suspense fallback={<div className="loading-container">Loading...</div>}>
          <Routes>
            <Route path="/" element={
              isLoggedIn 
                ? <Navigate to="/vital-signs" /> 
                : <AuthApp onLoginSuccess={() => refetch()} />
            } />
            <Route 
              path="/vital-signs/*" 
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <VitalSignsApp user={data?.currentUser} />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Container>
    </div>
  );
}

export default App;