import React from 'react';
import { Form, Button } from 'react-bootstrap';

const AppointmentBooking = ({
  selectedDate,
  availableSlots,
  handleSlotSelection,
  handleAppointmentBooking,
  selectedDoctor,
  patientName,
  appointmentType,
  notes,
}) => {
  return (
    <div>
      <Form>
        <Form.Group controlId="slot">
          <Form.Label>Slot</Form.Label>
          <Form.Control
            as="select"
            value={availableSlots[0]}
            onChange={(e) => handleSlotSelection(e.target.value)}
          >
            {availableSlots.map((slot) => (
              <option key={slot}>{slot}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="patientName">
          <Form.Label>Patient Name</Form.Label>
          <Form.Control type="text" placeholder="Patient Name" />
        </Form.Group>
        <Form.Group controlId="appointmentType">
          <Form.Label>Appointment Type</Form.Label>
          <Form.Control type="text" placeholder="Appointment Type" />
        </Form.Group>
        <Form.Group controlId="notes">
          <Form.Label>Notes</Form.Label>
          <Form.Control type="text" placeholder="Notes" />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleAppointmentBooking({
                doctorId: selectedDoctor.id,
                date: selectedDate,
                startTime: availableSlots[0],
                endTime: availableSlots[1],
                patientName,
                notes,
                patientId: Math.floor(Math.random() * 1000000), // Random patient ID for testing purposes
  

        
          
            });
          }}
        >
          Book Appointment
        </Button>
      </Form>
    </div>
  );
};

export default AppointmentBooking;