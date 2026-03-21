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
