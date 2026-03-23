# Farmers Choice - Contractor Attendance System 🚜

A full-stack MERN (MongoDB, Express, React, Node.js) application designed to digitalize and streamline the tracking of daily contractor attendance for Farmers Choice. 

## 🌟 Key Features
- **Role-Based Access Control:** Secure portal with specific permissions for Admin, Guard, and Payroll staff.
- **Worker Management:** Centralized registry for all contract workers.
- **Gate Check-In/Check-Out:** Efficiently track when workers enter and exit the facility.
- **Instant Reporting:** Quickly generate and export custom attendance reports to PDF and Excel format.

---

## 🛠️ Technology Stack
- **Frontend:** React, React Router, Axios
- **Backend:** Node.js, Express.js, JWT Authentication
- **Database:** MongoDB via Mongoose
- **Reporting:** `jspdf` & `xlsx` 

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your local machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MwangangiD/farmers-attendance.git
   cd farmers-attendance
   ```

2. **Backend Setup (`/server`):**
   ```bash
   cd server
   npm install
   ```
   *Create a `.env` file in the `/server` directory and add your environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, `PORT=5000`).*
   
   *Start the backend server:*
   ```bash
   npm run dev
   ```

3. **Frontend Setup (`/client`):**
   ```bash
   # In a new terminal from the root folder
   cd client
   npm install
   ```
   *Start the React app:*
   ```bash
   npm start
   ```

## 🔒 Default Demo Accounts
*(These are generated automatically upon your first backend start via the database seed script)*
- **Admin Role:** `admin@farmerschoice.com` (Password: `admin123`)
- **Guard Role:** `guard@farmerschoice.com` (Password: `guard123`)
- **Payroll Role:** `payroll@farmerschoice.com` (Password: `payroll123`)
