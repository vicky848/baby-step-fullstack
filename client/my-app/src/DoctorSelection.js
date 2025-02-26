import React from 'react';
import { Card, Button } from 'react-bootstrap';

const DoctorSelection = ({ doctors, handleDoctorSelection }) => {
  return (
    <div>
      {doctors.map((doctor) => (
        <Card key={doctor.id}>
          <Card.Body>
            <Card.Title>{doctor.name}</Card.Title>
            <Button
              variant="primary"
              onClick={() => handleDoctorSelection(doctor)}
            >
              Select
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default DoctorSelection;