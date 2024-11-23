import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [chatLog, setChatLog] = useState([
    { sender: "bot", message: "Hello! How can I assist you today?" },
    { sender: "bot", message: "1. Crop Recommendation\n2. Fertilizer Recommendation" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [form, setForm] = useState(null);

  const handleUserInput = (input) => {
    const newLog = [...chatLog, { sender: "user", message: input }];
    setChatLog(newLog);
    if (input === "1") {
      setForm("crop");
      setChatLog([...newLog, { sender: "bot", message: "Please provide the following details:" }]);
    } else if (input === "2") {
      setForm("fertilizer");
      setChatLog([...newLog, { sender: "bot", message: "Please provide the following details:" }]);
    } else {
      setChatLog([...newLog, { sender: "bot", message: "Invalid option. Please choose 1 or 2." }]);
    }
    setUserInput("");
  };

  const handleSubmit = async (formData) => {
    try {
      const endpoint = form === "crop" ? "/crop_recommendation/" : "/fertilizer_recommendation/";
      const response = await axios.post(`http://localhost:8000${endpoint}`, formData);
      const resultKey = form === "crop" ? "recommended_crop" : "recommended_fertilizer";
      setChatLog([
        ...chatLog,
        { sender: "bot", message: `Recommended ${resultKey.replace("_", " ")}: ${response.data[resultKey]}` },
      ]);
    } catch (error) {
      setChatLog([...chatLog, { sender: "bot", message: "Error processing your request. Please try again." }]);
    }
    setForm(null);
  };

  return (
    <div style={{ width: "400px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "10px", height: "400px", overflowY: "auto" }}>
        {chatLog.map((entry, index) => (
          <div key={index} style={{ textAlign: entry.sender === "bot" ? "left" : "right", margin: "10px 0" }}>
            <span style={{ padding: "10px", borderRadius: "10px", backgroundColor: entry.sender === "bot" ? "#f0f0f0" : "#d1f7c4" }}>
              {entry.message}
            </span>
          </div>
        ))}
      </div>
      {form === "crop" && (
        <CropForm onSubmit={handleSubmit} />
      )}
      {form === "fertilizer" && (
        <FertilizerForm onSubmit={handleSubmit} />
      )}
      {!form && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            style={{ width: "80%", padding: "10px" }}
          />
          <button onClick={() => handleUserInput(userInput)} style={{ padding: "10px", marginLeft: "10px" }}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

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
        <div key={key} style={{ marginBottom: "10px" }}>
          <label>{key.toUpperCase()}: </label>
          <input type="text" name={key} value={formData[key]} onChange={handleChange} required />
        </div>
      ))}
      <button type="submit">Submit</button>
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
        <div key={key} style={{ marginBottom: "10px" }}>
          <label>{key.toUpperCase()}: </label>
          <input type="text" name={key} value={formData[key]} onChange={handleChange} required />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default App;
