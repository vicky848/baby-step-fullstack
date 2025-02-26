Doctor Appointment Booking System

Table of Contents
1. #overview
2. #features
3. #technologies-used
4. #installation
5. #usage
6. #api-endpoints
7. #contributing
8. #license

Overview
This project is a web-based doctor appointment booking system built using React.js, Node.js, and SQLite. The system allows patients to book appointments with doctors, view available time slots, and manage their appointments.

Features
- Patient registration and login
- Doctor selection and appointment booking
- Available time slot viewing and selection
- Appointment management (view, update, delete)
- Responsive design using Bootstrap

Technologies Used
- React.js
- Node.js
- Express.js
- SQLite
- Bootstrap

Installation
1. Clone the repository using git clone.
2. Install dependencies using npm install.
3. Start the server using node index.js.
4. Start the React application using npm start.

Usage
1. Open a web browser and navigate to http://localhost:3000.
2. Register or login to the application.
3. Select a doctor and book an appointment.
4. View available time slots and select a slot.
5. Manage your appointments (view, update, delete).

API Endpoints
GET /doctors
Returns a list of all doctors.

GET /doctors/:id/slots
Returns a list of available time slots for a specific doctor.

GET /appointments
Returns a list of all appointments.

GET /appointments/:id
Returns a specific appointment by ID.

POST /appointments
Creates a new appointment.

PUT /appointments/:id
Updates an existing appointment.

DELETE /appointments/:id
Deletes an existing appointment.

Contributing
Contributions are welcome!

License
This project is licensed under the MIT License.
