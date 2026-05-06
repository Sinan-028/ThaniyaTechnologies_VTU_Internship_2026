import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const token = localStorage.getItem("token");

  // 🔄 FETCH APPOINTMENTS
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/appointments/doctor-appointments",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 🔥 UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/appointments/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage(`Appointment ${status}`);
      fetchAppointments();
    } catch {
      setMessage("Update failed");
    }
  };

  // 🔥 TOGGLE AVAILABILITY
  const toggleAvailability = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/users/availability",
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setIsAvailable(res.data.isAvailable);
      setMessage(
        res.data.isAvailable
          ? "You are now AVAILABLE"
          : "You are now UNAVAILABLE"
      );
    } catch {
      setMessage("Failed to update availability");
    }
  };

  // 🎨 STATUS STYLE
  const getStatusStyle = (status) => {
    if (status === "confirmed") return "bg-green-100 text-green-600";
    if (status === "cancelled") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
  };

  // 📊 COUNTS
  const pending = appointments.filter(a => a.status === "pending").length;
  const confirmed = appointments.filter(a => a.status === "confirmed").length;
  const cancelled = appointments.filter(a => a.status === "cancelled").length;

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center mb-6">
        👨‍⚕️ Doctor Dashboard
      </h1>

      {/* 🔔 MESSAGE */}
      {message && (
        <p className="text-center text-green-600 mb-4">{message}</p>
      )}

      {/* 🔥 AVAILABILITY */}
      <div className="text-center mb-6">
        <button
          onClick={toggleAvailability}
          className={`px-4 py-2 rounded text-white ${
            isAvailable ? "bg-green-600" : "bg-gray-500"
          }`}
        >
          {isAvailable ? "Available" : "Unavailable"}
        </button>
      </div>

      {/* 📊 STATS */}
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-yellow-100 p-4 rounded-xl">
          <h2 className="text-xl font-bold">{pending}</h2>
          <p className="text-sm">Pending</p>
        </div>

        <div className="bg-green-100 p-4 rounded-xl">
          <h2 className="text-xl font-bold">{confirmed}</h2>
          <p className="text-sm">Confirmed</p>
        </div>

        <div className="bg-red-100 p-4 rounded-xl">
          <h2 className="text-xl font-bold">{cancelled}</h2>
          <p className="text-sm">Cancelled</p>
        </div>
      </div>

      {/* 📋 APPOINTMENTS */}
      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">
          No appointments yet
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">

          {appointments.map((app) => (
            <div
              key={app._id}
              className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
            >
              
              {/* LEFT */}
              <div>
                <h3 className="font-semibold">
                  Patient: {app.patient?.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(app.appointmentDate).toLocaleDateString()}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">

                <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(app.status)}`}>
                  {app.status}
                </span>

                {app.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(app._id, "confirmed")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() => updateStatus(app._id, "cancelled")}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}

              </div>

            </div>
          ))}

        </div>
      )}
    </Layout>
  );
};

export default DoctorDashboard;