import React, { useState, useEffect} from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");

  const API = "http://localhost:5000/api/students";

  const fetchStudents = async () => {
    const res = await axios.get(API);
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  },[]);

const addStudent = async () => {

  if (!name || !course) {
    alert("Please enter name and course");
    return;
  }

  const newStudent = {
    id: students.length + 1,
    name: name,
    course: course
  };

  try {

    await axios.post(API, newStudent);

    fetchStudents();

    setName("");
    setCourse("");

  } catch (err) {
    console.log(err);
  }
};

  const deleteStudent = async (id) => {

  try {

    await axios.delete(`${API}/${id}`);

    fetchStudents();

  } catch (err) {
    console.log(err);
  }

};
 return (
  <div className="container">

    <h2>Student Manager</h2>

    <input
      type="text"
      placeholder="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <input
      type="text"
      placeholder="Course"
      value={course}
      onChange={(e) => setCourse(e.target.value)}
    />

    <button className="add-btn" onClick={addStudent}>
      Add Student
    </button>

    <hr />

    {students.map((s) => (
      <div key={s.id} className="student-item">

        <span>{s.name} - {s.course}</span>

        <button
          className="delete-btn"
          onClick={() => deleteStudent(s.id)}
        >
          Delete
        </button>

      </div>
    ))}

  </div>
);
}

export default App;