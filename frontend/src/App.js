import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [chatLog, setChatLog] = useState([
    { sender: "bot", message: "Hello! How can I assist you today?" },
    { sender: "bot", message: "1. Crop Recommendation\n2. Fertilizer Recommendation" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [form, setForm] = useState(null);

  const handleUserInput = async (input) => {
    const newLog = [...chatLog, { sender: "user", message: input }];
    setChatLog(newLog);
    setUserInput("");

    if (input === "1") {
      setForm("crop");
    } else if (input === "2") {
      setForm("fertilizer");
    } else {
      // Handle free-text input using the `/generate` endpoint
      try {
        const response = await axios.post("http://54.253.10.129:8080/generate", {
          user_content: input,
        });
        setChatLog([
          ...newLog,
          { sender: "bot", message: response.data.response },
        ]);
      } catch (error) {
        setChatLog([
          ...newLog,
          { sender: "bot", message: "Sorry, I couldn't process your request. Please try again." },
        ]);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const endpoint = form === "crop" ? "/crop_recommendation/" : "/fertilizer_recommendation/";
      const response = await axios.post(`http://54.253.10.129:8080${endpoint}`, formData);
      const resultKey = form === "crop" ? "recommended_crop" : "recommended_fertilizer";
      setChatLog([
        ...chatLog,
        { sender: "bot", message: `Recommended ${resultKey.replace("_", " ")}: ${response.data[resultKey]}` },
      ]);
    } catch (error) {
      setChatLog([...chatLog, { sender: "bot", message: "Error processing your request. Please try again." }]);
    }
    setForm(null); // Close the modal after submission
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          padding: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            height: "400px",
            overflowY: "auto",
            backgroundColor: "#fafafa",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {chatLog.map((entry, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: entry.sender === "bot" ? "flex-start" : "flex-end",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  maxWidth: "80%",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  backgroundColor: entry.sender === "bot" ? "#e9ecef" : "#0d6efd",
                  color: entry.sender === "bot" ? "#333" : "#fff",
                  textAlign: "left",
                }}
              >
                {entry.message}
              </span>
            </div>
          ))}
        </div>
        {!form && (
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: "1",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
            <button
              onClick={() => handleUserInput(userInput)}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#0d6efd",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        )}
        {form && (
          <Modal onClose={() => setForm(null)}>
            {form === "crop" && <CropForm onSubmit={handleSubmit} />}
            {form === "fertilizer" && <FertilizerForm onSubmit={handleSubmit} />}
          </Modal>
        )}
      </div>
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "500px",
        width: "100%",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {children}
      <button
        onClick={onClose}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  </div>
);

const FormField = ({ label, name, value, onChange }) => (
  <div style={{ marginBottom: "15px" }}>
    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        outline: "none",
      }}
      required
    />
  </div>
);

const CropForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {Object.keys(formData).map((key) => (
        <FormField key={key} label={key.toUpperCase()} name={key} value={formData[key]} onChange={handleChange} />
      ))}
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#198754",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </form>
  );
};

const FertilizerForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    moisture: "",
    soil_type: "",
    crop_type: "",
    nitrogen: "",
    potassium: "",
    phosphorous: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {Object.keys(formData).map((key) => (
        <FormField key={key} label={key.toUpperCase()} name={key} value={formData[key]} onChange={handleChange} />
      ))}
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#198754",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default App;
