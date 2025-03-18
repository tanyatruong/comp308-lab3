import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Table, Button, Card, Alert, Spinner, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GET_VITAL_SIGNS, DELETE_VITAL_SIGN } from '../graphql/queries';

const VitalSignsList = ({ user }) => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_VITAL_SIGNS);
  
  const [deleteVitalSign] = useMutation(DELETE_VITAL_SIGN, {
    onCompleted: () => refetch(),
  });

  const handleAddNewClick = () => navigate('/vital-signs/new');
  const handleEditClick = (id) => navigate(`/vital-signs/edit/${id}`);
  const handleViewClick = (id) => navigate(`/vital-signs/view/${id}`);
  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteVitalSign({ variables: { id } });
    }
  };

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
      <Card className="p-4 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Vital Signs Records</h2>
            <Button variant="primary" onClick={handleAddNewClick}>Add New Record</Button>
          </div>
          {loading ? (
            <Spinner animation="border" className="d-block mx-auto" />
          ) : error ? (
            <Alert variant="danger">Error: {error.message}</Alert>
          ) : data.vitalSigns.length === 0 ? (
            <Alert variant="warning">No vital sign records found.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Pulse Rate</th>
                  <th>Blood Pressure</th>
                  <th>Temperature</th>
                  <th>Respiratory Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.vitalSigns.map((sign) => (
                  <tr key={sign.id}>
                    <td>{formatDate(sign.createdAt)}</td>
                    <td>{sign.pulseRate} bpm</td>
                    <td>{sign.bloodPressure} mmHg</td>
                    <td>{sign.temperature}°C</td>
                    <td>{sign.respiratoryRate} bpm</td>
                    <td className="d-flex gap-2">
                      <Button variant="info" size="sm" onClick={() => handleViewClick(sign.id)}>View</Button>
                      <Button variant="warning" size="sm" onClick={() => handleEditClick(sign.id)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteClick(sign.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VitalSignsList;
