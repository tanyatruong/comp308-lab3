import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Table, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GET_VITAL_SIGNS, DELETE_VITAL_SIGN } from '../graphql/queries';

const VitalSignsList = ({ user }) => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_VITAL_SIGNS);
  
  const [deleteVitalSign] = useMutation(DELETE_VITAL_SIGN, {
    onCompleted: () => refetch()
  });

  const handleAddNewClick = () => navigate('/vital-signs/new');
  const handleEditClick = (id) => navigate(`/vital-signs/edit/${id}`);
  const handleViewClick = (id) => navigate(`/vital-signs/view/${id}`);
  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteVitalSign({ variables: { id } });
    }
  };

  if (loading) return (
    <div className="text-center p-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );

  if (error) return <Alert variant="danger">Error loading vital signs: {error.message}</Alert>;

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
    <div>
      <Row className="align-items-end mb-3">
        <Col><h2>My Vital Signs</h2></Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleAddNewClick}>Add New Record</Button>
        </Col>
      </Row>

      {data && data.vitalSigns.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <Card.Title>No Vital Signs Records</Card.Title>
            <Card.Text>
              You haven't recorded any vital signs yet. Click the button below to add your first record.
            </Card.Text>
            <Button variant="primary" onClick={handleAddNewClick}>Add New Record</Button>
          </Card.Body>
        </Card>
      ) : (
        <Table striped bordered hover responsive className="vital-signs-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Pulse Rate</th>
              <th>Blood Pressure</th>
              <th>Weight (kg)</th>
              <th>Temperature (°C)</th>
              <th>Respiratory Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.vitalSigns.map((vitalSign) => (
              <tr key={vitalSign.id}>
                <td>{formatDate(vitalSign.createdAt)}</td>
                <td>{vitalSign.pulseRate} bpm</td>
                <td>{vitalSign.bloodPressure} mmHg</td>
                <td>{vitalSign.weight}</td>
                <td>{vitalSign.temperature}</td>
                <td>{vitalSign.respiratoryRate} bpm</td>
                <td className="d-flex gap-2">
                  <Button variant="info" size="sm" onClick={() => handleViewClick(vitalSign.id)}>View</Button>
                  <Button variant="warning" size="sm" onClick={() => handleEditClick(vitalSign.id)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteClick(vitalSign.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default VitalSignsList;