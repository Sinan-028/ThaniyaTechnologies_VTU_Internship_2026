# Day 10 – Node.js + MongoDB Integration

## Overview

Today I implemented the connection between Node.js and MongoDB using Mongoose. This step marks the beginning of real backend development with database integration.

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose

## Features Implemented

* Created an Express server
* Connected MongoDB using Mongoose
* Defined a Mongoose schema and model (Student)
* Built API to add student data (POST)
* Built API to fetch student data (GET)

## API Endpoints

### 1. Add Student

POST /add-student

Request Body:
{
"name": "Sinan",
"course": "MERN",
"skills": ["React", "Node"]
}

Response:
Student Added Successfully

---

### 2. Get Students

GET /students

Response:
Returns list of all students from database

## Project Structure

Day_10/
│── models/
│   └── Student.js
│── server.js
│── package.json

## Key Learning

Learned how backend communicates with a database using Mongoose. Understood schema creation, model usage, and API integration with MongoDB.

## Result

Successfully connected Node.js server with MongoDB and performed data insertion and retrieval using APIs.

# 🚀 Developer Portfolio Evaluator

A full-stack MERN application that analyzes GitHub profiles and provides insights like activity, code quality, diversity, and hiring readiness.

---

## ✨ Features

- 🔍 GitHub profile analysis  
- 📊 Score calculation system  
- ⚖️ Compare developers  
- 📄 Download report as PDF  
- ⭐ Save favorite profiles  

---

## 🛠️ Tech Stack

- Frontend: React, Vite  
- Backend: Node.js, Express  
- Database: MongoDB  
- Charts: Chart.js  
- API: GitHub REST API  

---

## 📸 Screenshots

### 🏠 Home Page
![Home](./screenshots/home.jpeg)

### 👤 Profile Page
![Profile](./screenshots/profile.jpeg)

### 📊 Score Breakdown
![Score Breakdown](./screenshots/score-breakdown.jpeg)

### 📈 Visualization
![Visualization](./screenshots/visualization.jpeg)

### 🧠 Language Usage
![Language](./screenshots/language.jpeg)

### 📂 Top Repositories
![Top Repos](./screenshots/top-repos.jpeg)

### ⚖️ Compare Developers
![Compare](./screenshots/compare.jpeg)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Sinan-028/ThaniyaTechnologies_VTU_Internship_2026

### Live Demo
https://thaniya-technologies-vtu-internship.vercel.app/