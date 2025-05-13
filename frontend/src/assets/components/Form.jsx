import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    phone_number: "",
  });
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistrationStatus(null);
    setErrorMessage("");

    let method;
    let url;

    if (isEditing) {
      method = "PUT";
      url = `/api/registrations/${editingId}`;
    } else {
      method = "POST";
      url = "/api/register";
    }

    try {
      const res = await fetch(url, {
        method: method, // Use the determined method (PUT or POST)
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: `${formData.first_name} ${formData.last_name}`,
          email: formData.email,
          birthdate: formData.birthdate,
          phone_number: formData.phone_number,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || `Registration ${isEditing ? "update" : "failed"}`
        );
      }

      setRegistrationStatus("success");
      navigate("/");
    } catch (err) {
      setRegistrationStatus("error");
      setErrorMessage(err.message);
    }
  };

  useEffect(() => {
    if (location.state?.registration) {
      const { registration } = location.state;
      setIsEditing(true);
      setEditingId(registration.id);
      setFormData({
        first_name: registration.full_name.split(" ")[0] || "",
        last_name: registration.full_name.split(" ")[1] || "",
        email: registration.email || "",
        birthdate: registration.birthdate || "",
        phone_number: registration.phone_number || "",
      });
    } else {
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        birthdate: "",
        phone_number: "",
      });
    }
  }, [location.state]);

  return (
    <form
      className="space-y-4 p-6 border rounded-md shadow-lg bg-white"
      onSubmit={handleSubmit}
    >
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <input
        name="first_name"
        className="w-full p-3 border rounded"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />

      <input
        name="last_name"
        className="w-full p-3 border rounded"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        className="w-full p-3 border rounded"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        name="birthdate"
        type="date"
        className="w-full p-3 border rounded"
        value={formData.birthdate}
        onChange={handleChange}
        required
      />

      <input
        name="phone_number"
        type="tel"
        className="w-full p-3 border rounded"
        placeholder="Phone Number"
        value={formData.phone_number}
        onChange={handleChange}
        required
      />

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-md"
        >
          {isEditing ? "Update Registration" : "Register"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-gray-400 text-white px-6 py-3 rounded-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Form;
