
const express = require('express');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const app = express();
const port = 3000;
const dbPath = path.join(__dirname, 'booking.db');
let db = null;
app.use(express.json());
const initializationDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

  //  table create
    await db.run(`
      CREATE TABLE IF NOT EXISTS doctor (
        id INTEGER PRIMARY KEY,
        name TEXT,
        start_time TEXT,
        end_time TEXT
      );
    `);

    await db.run(`
     CREATE TABLE IF NOT EXISTS appointment (
    id INTEGER PRIMARY KEY,
    doctor_id INTEGER,
    date DATE,
    start_time TEXT,
    end_time TEXT,
    appointment_type TEXT,
    patient_name TEXT,
    notes TEXT,
    FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);
    `);

    // Data insert 
    await db.run(`
      INSERT INTO doctor (name, start_time, end_time) VALUES
      ('Dr. Rohan Sharma', '09:00', '17:00'),
      ('Dr. Priya Patel', '08:00', '16:00'),
      ('Dr. Karan Singh', '09:00', '18:00'),
      ('Dr. Nalini Rao', '08:00', '17:00'),
      ('Dr. Vikram Kumar', '09:00', '16:00'),
      ('Dr. Ritu Jain', '08:00', '18:00'),
      ('Dr. Amitabh Gupta', '09:00', '17:00'),
      ('Dr. Sunita Mishra', '08:00', '16:00'),
      ('Dr. Rajiv Dixit', '09:00', '18:00'),
      ('Dr. Leela Nair', '08:00', '17:00');
    `);

    await db.run(`
      INSERT INTO appointment (doctor_id, date, duration, appointment_type, patient_name, notes) VALUES
      (1, '2025-02-25', 30, 'Routine Check-Up', 'Rahul Kumar', 'Check-up for fever'),
      (2, '2025-02-26', 60, 'Surgery', 'Sonia Patel', 'Knee surgery'),
      (3, '2025-02-27', 30, 'Follow-up', 'Amit Singh', 'Follow-up for medication'),
      (4, '2025-02-28', 60, 'Ultrasound', 'Rajesh Rao', 'Ultrasound for pregnancy'),
      (5, '2025-03-01', 30, 'Routine Check-Up', 'Sneha Kumar', 'Check-up for blood pressure'),
      (6, '2025-03-02', 60, 'Surgery', 'Vikas Jain', 'Appendix surgery'),
      (7, '2025-03-03', 30, 'Follow-up', 'Priyanka Gupta', 'Follow-up for physical therapy'),
      (8, '2025-03-04', 60, 'Ultrasound', 'Rakesh Mishra', 'Ultrasound for gallstones'),
      (9, '2025-03-05', 30, 'Routine Check-Up', 'Neha Dixit', 'Check-up for diabetes'),
      (10, '2025-03-06', 60, 'Surgery', 'Sachin Nair', 'Heart surgery');
    `);

    console.log('Connected to the database.');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializationDBAndServer(); 



// GET /doctors
app.get('/doctors', async (req, res) => {
  try {
    const query = 'SELECT * FROM doctor';
    const doctors = await db.all(query);
    res.send(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error getting doctors');
  }
});

// GET /doctors/:id/slots?date=YYYY-MM-DD
app.get('/doctors/:id/slots', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const date = req.query.date;

    console.log(`Doctor ID: ${doctorId}, Date: ${date}`);

    // Convert doctorId to an integer (if applicable)
    const doctorIdInt = parseInt(doctorId, 10);
    if (isNaN(doctorIdInt)) {
      return res.status(400).send('Invalid doctor ID');
    }

    // Validate date format
    const requestedDate = new Date(date);
    if (isNaN(requestedDate.getTime())) {
      return res.status(400).send('Invalid date format');
    }

    // Fetch doctor's slots
    const query = `
      SELECT * FROM appointment
      WHERE doctor_id = ? AND date = ?
    `;
    const slots = await db.all(query, [doctorIdInt, date]);

    console.log(`Slots: ${JSON.stringify(slots)}`);

    res.json(slots);
  } catch (err) {
    console.error('Database Error:', err.message);
    res.status(500).send('Error getting doctor\'s slots');
  }
});

  
// GET /appointments
app.get('/appointments', async (req, res) => {
  try {
    const query = `
      SELECT appointment.*, doctor.name AS doctor_name
      FROM appointment
      JOIN doctor ON appointment.doctor_id = doctor.id
    `;
    const appointments = await db.all(query);
    res.send(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error getting appointments');
  }
});

// GET /appointments/:id
app.get('/appointments/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const query = `
      SELECT appointment.*, doctor.name AS doctor_name
      FROM appointment
      JOIN doctor ON appointment.doctor_id = doctor.id
      WHERE appointment.id = ?
    `;
    const appointment = await db.get(query, appointmentId);
    if (!appointment) {
      res.status(404).send('Appointment not found');
    } else {
      res.send(appointment);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error getting appointment');
  }
}); 

// POST /appointments
app.post('/appointments', async (req, res) => {
  try {
    const { doctorId, date, startTime, endTime, patientName, notes } = req.body;

    // Validate inputs
    if (!doctorId || !date || !startTime || !endTime || !patientName) {
      return res.status(400).send('Missing required fields');
    }

    // Validate date format
    const requestedDate = new Date(date);
    if (isNaN(requestedDate)) {
      return res.status(400).send('Invalid date format');
    }

    // Validate time format
    const requestedStartTime = new Date(`1970-01-01T${startTime}`);
    const requestedEndTime = new Date(`1970-01-01T${endTime}`);
    if (isNaN(requestedStartTime) || isNaN(requestedEndTime)) {
      return res.status(400).send('Invalid time format');
    }

    // Check if time slot is available
    const query = `
      SELECT * FROM appointment
      WHERE doctor_id = ? AND date = ? AND (start_time <= ? AND end_time >= ?)
    `;
    const existingAppointment = await db.get(query, doctorId, date, startTime, endTime);
    if (existingAppointment) {
      return res.status(400).send('Time slot is not available');
    }

    // Create new appointment
    const insertedId = await db.run(`
      INSERT INTO appointment (doctor_id, date, start_time, end_time, patient_name, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `, doctorId, date, startTime, endTime, patientName, notes);

    res.status(201).send({ id: insertedId.lastID });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error creating appointment');
  }
});

// PUT /appointments/:id
app.put('/appointments/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { doctorId, date, startTime, endTime, patientName, notes } = req.body;

    // Validate inputs
    if (!doctorId || !date || !startTime || !endTime || !patientName) {
      return res.status(400).send('Missing required fields');
    }

    // Validate date format
    const requestedDate = new Date(date);
    if (isNaN(requestedDate)) {
      return res.status(400).send('Invalid date format');
    }

    // Validate time format
    const requestedStartTime = new Date(`1970-01-01T${startTime}`);
    const requestedEndTime = new Date(`1970-01-01T${endTime}`);
    if (isNaN(requestedStartTime) || isNaN(requestedEndTime)) {
      return res.status(400).send('Invalid time format');
    }

    // Check if time slot is available
    const query = `
      SELECT * FROM appointment
      WHERE doctor_id = ? AND date = ? AND (start_time <= ? AND end_time >= ?)
      AND id != ?
    `;
    const existingAppointment = await db.get(query, doctorId, date, startTime, endTime, appointmentId);
    if (existingAppointment) {
      return res.status(400).send('Time slot is not available');
    }

    // Update appointment
    await db.run(`
      UPDATE appointment
      SET doctor_id = ?, date = ?, start_time = ?, end_time = ?, patient_name = ?, notes = ?
      WHERE id = ?
    `, doctorId, date, startTime, endTime, patientName, notes, appointmentId);

    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error updating appointment');
  }
});

// DELETE /appointments/:id
app.delete('/appointments/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Delete appointment
    await db.run(`
      DELETE FROM appointment
      WHERE id = ?
    `, appointmentId);

    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error deleting appointment');
  }
});
