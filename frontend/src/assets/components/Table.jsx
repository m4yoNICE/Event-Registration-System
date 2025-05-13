import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Table = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch("/api/registrations");
      const data = await res.json();
      setRegistrations(data);
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRegistrations(registrations.filter((reg) => reg.id !== id));
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to delete registration.");
      }
    } catch (e) {
      setError("Error deleting registration: " + e.message);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  if (loading) {
    return <div>Loading registrations...</div>;
  }

  if (error) {
    return <div>Error loading registrations: {error}</div>;
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">
              Full Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Birthdate
            </th>
            <th scope="col" className="px-6 py-3">
              Phone Number
            </th>
            <th scope="col" className="px-6 py-3">
              Registered At
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration) => (
            <tr
              key={registration.id}
              className="bg-white border-b border-gray-200"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {registration.full_name}
              </th>
              <td className="px-6 py-4">{registration.email}</td>
              <td className="px-6 py-4">{registration.birthdate}</td>
              <td className="px-6 py-4">{registration.phone_number}</td>
              <td className="px-6 py-4">{registration.registered_at}</td>
              <td className="px-6 py-4">
                <button
                  className="font-medium text-blue-600 hover:underline me-2"
                  onClick={() =>
                    navigate("/register", { state: { registration } })
                  }
                >
                  Edit
                </button>
                <button
                  className="font-medium text-red-600 hover:underline"
                  onClick={() => handleDelete(registration.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
