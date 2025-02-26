import React from 'react';
import { Calendar } from 'react-calendar';

const CalendarView = ({ selectedDoctor, handleDateSelection }) => {
  return (
    <div>
      <Calendar
        value={new Date()}
        onChange={(date) => handleDateSelection(date)}
      />
    </div>
  );
};

export default CalendarView;