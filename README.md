# Node.js Intern Assessment - Task 1: API Creation

This repository contains the backend API solution for the Node.js Intern Assessment (Task 1). The application is built using **Node.js**, **Express**, and the **MongoDB Native Driver** (without Mongoose), allowing for a flexible, schema-less architecture as per the requirements.

## 🛠 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Native Driver)
- **File Handling:** Multer (for image uploads)
- **Environment:** Dotenv

## Project Structure
```bash
task1/
├── uploads/            # Stores uploaded event images
├── .env                # Environment variables (MongoDB URI, Port)
├── package.json        # Dependencies and scripts
├── routes.js           # API Routes and logic
└── server.js           # Entry point and DB connection



Setup & Installation
Clone the repository (or download the source code).

Install Dependencies:npm install

Configure Environment: Create a .env file in the root directory and add your credentials:

PORT=3000
MONGO_URI=your mongoDB uri
DB_NAME=task1


Start the Server:npm start
The server will run at http://localhost:3000.


Api end Points Link:https://docs.google.com/spreadsheets/d/1luuzirZvesF7-eiSWx9mwKtX-dcC3d_1HllCioH4PU4/edit?gid=1062502650#gid=1062502650
