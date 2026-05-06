import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  // 🔄 Fetch doctors
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  //  Book appointment
  const book = async () => {
    if (!token) {
      setMessage("Please login again");
      return;
    }

    if (!selectedDate) {
      setMessage("Please select a date");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          doctorId: selectedDoctor,
          appointmentDate: selectedDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Appointment booked successfully!");
      setSelectedDoctor(null);
      setSelectedDate("");

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Booking failed. Try again."
      );
    }
  };

  //  FILTER DOCTORS
  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center mb-6">
        👨‍⚕️ Available Doctors
      </h1>

      {/*  SEARCH */}
      <div className="max-w-4xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by name or specialization"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* MESSAGE */}
      {message && (
        <p className="text-center text-green-600 mb-4">{message}</p>
      )}

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-gray-500">Loading doctors...</p>
      ) : (
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredDoctors.length === 0 ? (
            <p className="col-span-3 text-center text-gray-500">
              No doctors found
            </p>
          ) : (
            filteredDoctors.map((doc) => (
              <div
                key={doc._id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition duration-200"
              >

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-bold">
                    {doc.name?.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-semibold">{doc.name}</h3>
                    <p className="text-sm text-gray-500">
                      {doc.specialization}
                    </p>
                  </div>
                </div>

                {/* Availability */}
                <p
                  className={`text-sm mb-2 ${
                    doc.isAvailable ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {doc.isAvailable ? "Available" : "Unavailable"}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  📍 {doc.location || "Mangalore"}
                </p>

                {/* Button */}
                <button
                  disabled={!doc.isAvailable}
                  onClick={() => setSelectedDoctor(doc._id)}
                  className={`w-full py-2 rounded-lg text-white ${
                    doc.isAvailable
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {doc.isAvailable ? "Book Appointment" : "Unavailable"}
                </button>
              </div>
            ))
          )}

        </div>
      )}

      {/* BOOKING PANEL */}
      {selectedDoctor && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t flex justify-center gap-4 items-center">

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <button
            onClick={book}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Confirm Booking
          </button>

        </div>
      )}
    </Layout>
  );
};

export default Doctors;