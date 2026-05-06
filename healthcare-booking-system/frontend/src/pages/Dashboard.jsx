import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const Dashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}

  // 🚨 EMERGENCY SOS
  const emergencySOS = () => {
    if (window.confirm("🚨 Call emergency services (108)?")) {
      window.location.href = "tel:108";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/appointments/my-appointments",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setAppointments(res.data);
      } catch {}
    };

    fetchData();
  }, [token]);

  return (
    <Layout>

      {/* HERO */}
      <section className="text-center py-12 bg-blue-50 rounded-xl shadow-sm">
      
        <p className="text-3xl font-bold text-blue-600 mb-2">
          Welcome, {user?.name}
        </p>

        <p className="text-gray-500 text-sm">
          Your trusted healthcare appointment platform in Mangalore
        </p>
      </section>

      {/* SERVICES */}
      <section className="max-w-6xl mx-auto text-center py-10">
        <h2 className="text-xl font-semibold mb-6">Services</h2>

        <div className="grid md:grid-cols-3 gap-6">

          {/* FIND DOCTORS */}
          <div
            onClick={() => navigate("/doctors")}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
          >
            <div className="text-3xl mb-3">👨‍⚕️</div>
            <h3 className="font-semibold">Find Doctors</h3>
            <p className="text-sm text-gray-500">
              Search and book appointments
            </p>
          </div>

          {/* APPOINTMENTS */}
          <div
            onClick={() => navigate("/appointments")}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
          >
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-semibold">My Appointments</h3>
            <p className="text-sm text-gray-500">
              Track your bookings
            </p>
          </div>

          {/* 🚨 SOS */}
          <div
            onClick={emergencySOS}
            className="bg-red-50 border border-red-200 p-6 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
          >
            <div className="text-3xl mb-3">🚨</div>
            <h3 className="font-semibold text-red-600">
              Emergency SOS
            </h3>
            <p className="text-sm text-gray-500">
              Call emergency services instantly
            </p>
          </div>

        </div>
      </section>

      {/* OVERVIEW */}
      <section className="max-w-6xl mx-auto text-center py-10">
        <h2 className="text-xl font-semibold mb-6">Overview</h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-2xl font-bold text-blue-600">
              {appointments.length}
            </h3>
            <p className="text-gray-500 text-sm">Appointments</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-2xl font-bold text-blue-600">6+</h3>
            <p className="text-gray-500 text-sm">Doctors</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-2xl font-bold text-blue-600">24/7</h3>
            <p className="text-gray-500 text-sm">Support</p>
          </div>

        </div>
      </section>

      {/* RECENT APPOINTMENTS */}
      <section className="max-w-4xl mx-auto text-center py-10">
        <h2 className="text-xl font-semibold mb-6">
          Recent Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500">
            No appointments yet. Book your first appointment!
          </p>
        ) : (
          <div className="space-y-4">
            {appointments.slice(0, 3).map((app) => (
              <div
                key={app._id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div className="text-left">
                  <p className="font-medium">
                    {app.doctor?.name || "Doctor"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(app.appointmentDate).toLocaleDateString()}
                  </p>
                </div>

                <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section className="max-w-4xl mx-auto text-center py-10 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">About Us</h2>

        <p className="text-gray-600 leading-relaxed">
          HealthPoint is a modern healthcare appointment booking platform designed
          to simplify access to medical services. It enables patients to find doctors,
          book appointments, and manage their healthcare efficiently. The system also
          allows doctors to manage appointments and provide better care through a
          structured and user-friendly interface.
        </p>
      </section>

      {/* CONTACT */}
      <section className="max-w-4xl mx-auto text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p><strong>Email:</strong> support@healthpoint.com</p>
          <p><strong>Phone:</strong> +91 9876543210</p>
          <p><strong>Location:</strong> Deralakatte, Mangalore</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 border-t text-gray-500">
        © 2026 HealthPoint. All rights reserved.
      </footer>

    </Layout>
  );
};

export default Dashboard;