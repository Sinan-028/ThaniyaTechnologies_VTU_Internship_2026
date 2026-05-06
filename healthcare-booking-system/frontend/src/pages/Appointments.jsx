import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/appointments/my-appointments",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // CANCEL APPOINTMENT
  const cancelAppointment = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/appointments/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage("Appointment cancelled successfully");
      fetchAppointments();
    } catch (err) {
      setMessage("Cancel failed. Try again.");
    }
  };

  // STATUS COLOR
  const getStatusStyle = (status) => {
    if (status === "confirmed")
      return "bg-green-100 text-green-600";
    if (status === "cancelled")
      return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center mb-6">
        📅 My Appointments
      </h1>

      {/* MESSAGE */}
      {message && (
        <p className="text-center text-green-600 mb-4">
          {message}
        </p>
      )}

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-gray-500">
          Loading appointments...
        </p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-500">
          No appointments yet. Book your first appointment!
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">

          {appointments.map((app) => (
            <div
              key={app._id}
              className="bg-white p-5 rounded-xl shadow flex justify-between items-center hover:shadow-lg transition"
            >
              
              {/* LEFT */}
              <div>
                <h3 className="font-semibold text-lg">
                  {app.doctor?.name || "Doctor"}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(app.appointmentDate).toLocaleDateString()}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">

                <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(app.status)}`}>
                  {app.status || "pending"}
                </span>

                {app.status !== "cancelled" && (
                  <button
                    onClick={() => cancelAppointment(app._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>
      )}
    </Layout>
  );
};

export default Appointments;