import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formState, setFormState] = useState({
    isEditing: false,
    editingId: null,
    formData: {
      first_name: "",
      last_name: "",
      email: "",
      birthdate: "",
      phone_number: "",
    },
  });

  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistrationStatus(null);
    setErrorMessage("");

    let method;
    let url;

    if (formState.isEditing) {
      method = "PUT";
      url = `/api/registrations/${formState.editingId}`;
    } else {
      method = "POST";
      url = "/api/register";
    }

    const { formData } = formState;
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^09\d{9}$/;
    const birthdate = new Date(formData.birthdate);
    const now = new Date();
    const trimmed = {
      last_name: formData.last_name.trim(),
    };

    if (!nameRegex.test(formData.first_name)) {
      setErrorMessage(
        "First name must contain only letters and be at least 2 characters."
      );
      return;
    }

    if (!nameRegex.test(trimmed.last_name)) {
      return setErrorMessage("Last name must be at least 2 letters.");
    }

    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(formData.phone_number)) {
      setErrorMessage("Phone number must start with 09 and be 11 digits.");
      return;
    }

    if (
      isNaN(birthdate.getTime()) ||
      birthdate > now ||
      birthdate < new Date("1900-01-01")
    ) {
      return setErrorMessage("Enter an actual birthday, fake ahh");
    }

    try {
      const res = await fetch(url, {
        method: method,
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
          data.error ||
            `Registration ${formState.isEditing ? "update" : "failed"}`
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
      const [first_name, last_name] = registration.full_name.split(" ");
      setFormState({
        isEditing: true,
        editingId: registration.id,
        formData: {
          first_name: first_name || "",
          last_name: last_name || "",
          email: registration.email || "",
          birthdate: registration.birthdate || "",
          phone_number: registration.phone_number || "",
        },
      });
    } else {
      setFormState({
        isEditing: false,
        editingId: null,
        formData: {
          first_name: "",
          last_name: "",
          email: "",
          birthdate: "",
          phone_number: "",
        },
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
        value={formState.formData.first_name}
        onChange={handleChange}
        required
      />

      <input
        name="last_name"
        className="w-full p-3 border rounded"
        placeholder="Last Name"
        value={formState.formData.last_name}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        className="w-full p-3 border rounded"
        placeholder="Email"
        value={formState.formData.email}
        onChange={handleChange}
        required
      />

      <input
        name="birthdate"
        type="date"
        className="w-full p-3 border rounded"
        value={formState.formData.birthdate}
        onChange={handleChange}
        required
      />

      <input
        name="phone_number"
        type="tel"
        className="w-full p-3 border rounded"
        placeholder="Phone Number"
        value={formState.formData.phone_number}
        onChange={handleChange}
        required
      />

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-md"
        >
          {formState.isEditing ? "Update Registration" : "Register"}
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
