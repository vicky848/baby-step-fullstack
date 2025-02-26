import React from 'react';
import { Table } from 'react-bootstrap';

const AppointmentManagement = ({ appointments }) => {
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Slot</th>
            <th>Patient Name</th>
            <th>Appointment Type</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.doctorName}</td>
              <td>{appointment.date}</td>
              <td>{appointment.slot}</td>
              <td>{appointment.patientName}</td>
              <td>{appointment.appointmentType}</td>
              <td>{appointment.notes}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AppointmentManagement;