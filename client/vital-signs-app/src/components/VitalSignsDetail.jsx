import React from 'react';
import { useQuery } from '@apollo/client';
import { Card, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_VITAL_SIGN } from '../graphql/queries';

const VitalSignsDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { loading, error, data } = useQuery(GET_VITAL_SIGN, { 
    variables: { id }
  });
  
  const handleBackClick = () => {
    navigate('/');
  };
  
  const handleEditClick = () => {
    navigate(`/vital-signs/edit/${id}`);
  };
  
  if (loading) return (
    <div className="text-center p-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
  
  if (error) return (
    <Alert variant="danger">
      Error loading vital sign details: {error.message}
    </Alert>
  );
  
  if (!data || !data.vitalSign) {
    return (
      <Alert variant="warning">
        Vital sign record not found. It may have been deleted.
        <div className="mt-3">
          <Button variant="primary" onClick={handleBackClick}>Back to List</Button>
        </div>
      </Alert>
    );
  }
  
  const { vitalSign } = data;
  
  const formatDate = (dateString) => {
    const date = new Date(Number(dateString));
    return isNaN(date.getTime()) ? "N/A" : new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  return (
    <div className="detail-container">
      <div className="detail-header mb-4">
        <h2>Vital Signs Details</h2>
        <div>
          <Button variant="primary" onClick={handleEditClick} className="me-2">Edit</Button>
          <Button variant="secondary" onClick={handleBackClick}>Back to List</Button>
        </div>
      </div>
      
      <Card>
        <Card.Header>
          <strong>Recorded on:</strong> {formatDate(vitalSign.createdAt)}
          {vitalSign.updatedAt !== vitalSign.createdAt && (
            <div className="text-muted mt-1">
              <small>Last updated: {formatDate(vitalSign.updatedAt)}</small>
            </div>
          )}
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="detail-section">
              <div className="detail-label">Pulse Rate</div>
              <div className="detail-value">{vitalSign.pulseRate} bpm</div>
            </Col>
            <Col md={6} className="detail-section">
              <div className="detail-label">Blood Pressure</div>
              <div className="detail-value">{vitalSign.bloodPressure} mmHg</div>
            </Col>
          </Row>
          
          <Row>
            <Col md={4} className="detail-section">
              <div className="detail-label">Temperature</div>
              <div className="detail-value">{vitalSign.temperature} °C</div>
            </Col>
            <Col md={4} className="detail-section">
              <div className="detail-label">Respiratory Rate</div>
              <div className="detail-value">{vitalSign.respiratoryRate} bpm</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VitalSignsDetail;