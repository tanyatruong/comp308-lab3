import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_VITAL_SIGN, UPDATE_VITAL_SIGN, GET_VITAL_SIGN, GET_VITAL_SIGNS } from '../graphql/queries';

const VitalSignsForm = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    pulseRate: '',
    bloodPressure: '',
    temperature: '',
    respiratoryRate: ''
  });

  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

  // Query for getting existing vital sign data if in edit mode
  const { loading: queryLoading, error: queryError, data } = useQuery(
    GET_VITAL_SIGN,
    {
      variables: { id },
      skip: !isEditMode,
      onCompleted: (data) => {
        if (data.vitalSign) {
          setFormData({
            pulseRate: data.vitalSign.pulseRate,
            bloodPressure: data.vitalSign.bloodPressure,
            temperature: data.vitalSign.temperature,
            respiratoryRate: data.vitalSign.respiratoryRate
          });
        }
      }
    }
  );

  const [createVitalSign, { loading: createLoading }] = useMutation(CREATE_VITAL_SIGN, {
    onCompleted: () => navigate('/'),
    onError: (error) => setError(error.message),
    update: (cache, { data: { createVitalSign } }) => {
      try {
        const existingData = cache.readQuery({ query: GET_VITAL_SIGNS });
        if (existingData?.vitalSigns) {
          cache.writeQuery({
            query: GET_VITAL_SIGNS,
            data: { vitalSigns: [createVitalSign, ...existingData.vitalSigns] }
          });
        }
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    }
  });

  const [updateVitalSign, { loading: updateLoading }] = useMutation(UPDATE_VITAL_SIGN, {
    onCompleted: () => navigate('/'),
    onError: (error) => setError(error.message),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'bloodPressure' ? value : Number(value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const vitalSignInput = {
      pulseRate: parseInt(formData.pulseRate),
      bloodPressure: formData.bloodPressure,
      temperature: parseFloat(formData.temperature),
      respiratoryRate: parseInt(formData.respiratoryRate)
    };

    setError('');

    if (isEditMode) {
      updateVitalSign({ variables: { id, input: vitalSignInput } });
    } else {
      createVitalSign({ variables: { input: vitalSignInput } });
    }
  };

  const handleCancel = () => navigate('/');

  const isLoading = queryLoading || createLoading || updateLoading;

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-lg">
        <Card.Body>
        <Card.Header className="text-center mb-3">          
          <h3>{isEditMode ? 'Edit Vital Signs' : 'Add New Vital Signs'}</h3>
        </Card.Header>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pulse Rate (bpm)</Form.Label>
                  <Form.Control
                    type="number"
                    name="pulseRate"
                    value={formData.pulseRate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Blood Pressure (mmHg)</Form.Label>
                  <Form.Control
                    type="text"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Temperature (°C)</Form.Label>
                  <Form.Control
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Respiratory Rate (bpm)</Form.Label>
                  <Form.Control
                    type="number"
                    name="respiratoryRate"
                    value={formData.respiratoryRate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isEditMode ? 'Update' : 'Save'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VitalSignsForm;
