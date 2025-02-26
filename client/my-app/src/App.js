import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import DoctorSelection from './DoctorSelection';
import CalendarView from './CalendarView';
import AppointmentBooking from './AppointmentBooking';
import AppointmentManagement from './AppointmentManagement';

import './App.css';



function App() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
   // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
   // eslint-disable-next-line
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3000/doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchDoctors();
  }, []);

  const handleDoctorSelection = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
  };

  const handleSlotSelection = async(slot) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/appointments/${selectedDoctor.id}?date=${selectedDate}`);
      const data = await response.json();
      setAvailableSlots(data);
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
    
  };

  const handleAppointmentBooking = async (appointmentData) => {
    try {
      const response = await fetch('/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      
      });
      const data = await response.json();
      setAppointments((prevAppointments) => [...prevAppointments, data]);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<DoctorSelection doctors={doctors} handleDoctorSelection={handleDoctorSelection} />} />
      <Route path="/calendar" element={<CalendarView selectedDoctor={selectedDoctor} handleDateSelection={handleDateSelection} />} />
      <Route path="/book-appointment" element={<AppointmentBooking selectedDate={selectedDate} availableSlots={availableSlots} handleSlotSelection={handleSlotSelection} handleAppointmentBooking={handleAppointmentBooking} selectedDoctor={selectedDoctor} />} />
      <Route path="/appointments" element={<AppointmentManagement appointments={appointments} />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
