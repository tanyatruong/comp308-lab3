import React from 'react';
import { useQuery } from '@apollo/client';
import { Card, Row, Col, Button, Alert, Spinner, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_VITAL_SIGN } from '../graphql/queries';

const VitalSignsDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { loading, error, data } = useQuery(GET_VITAL_SIGN, { 
    variables: { id }
  });

  const handleBackClick = () => navigate('/');
  const handleEditClick = () => navigate(`/vital-signs/edit/${id}`);

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );

  if (error) return (
    <Container className="mt-4">
      <Alert variant="danger">Error loading vital sign details: {error.message}</Alert>
    </Container>
  );

  if (!data || !data.vitalSign) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Vital sign record not found. It may have been deleted.
          <div className="mt-3">
            <Button variant="primary" onClick={handleBackClick}>Back to List</Button>
          </div>
        </Alert>
      </Container>
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
    <Container className="mt-4">
      <Card className="shadow-lg">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Vital Signs Details</h3>
          <div>
            <Button variant="primary" onClick={handleEditClick} className="me-2">Edit</Button>
            <Button variant="secondary" onClick={handleBackClick}>Back</Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <strong>Recorded at:</strong> {formatDate(vitalSign.createdAt)}
          </div>
          {vitalSign.updatedAt !== vitalSign.createdAt && (
            <div className="mb-3 text-muted">
              <small><strong>Last updated:</strong> {formatDate(vitalSign.updatedAt)}</small>
            </div>
          )}
          
          <Row className="mb-3">
            <Col md={6}>
              <Card className="p-3 shadow-sm">
                <h5>Pulse Rate</h5>
                <p className="fs-5">{vitalSign.pulseRate} bpm</p>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="p-3 shadow-sm">
                <h5>Blood Pressure</h5>
                <p className="fs-5">{vitalSign.bloodPressure} mmHg</p>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card className="p-3 shadow-sm">
                <h5>Temperature</h5>
                <p className="fs-5">{vitalSign.temperature} °C</p>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="p-3 shadow-sm">
                <h5>Respiratory Rate</h5>
                <p className="fs-5">{vitalSign.respiratoryRate} bpm</p>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VitalSignsDetail;
