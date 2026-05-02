import { useEffect, useState } from "react";
import API from "../services/api";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get("/doctors");
        setDoctors(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Doctors</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <div key={doc._id} className="p-4 shadow-md rounded-xl bg-white">
            <h2 className="text-lg font-semibold">{doc.name}</h2>
            <p className="text-gray-500">{doc.specialization}</p>

            <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;