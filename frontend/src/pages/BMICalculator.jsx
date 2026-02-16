import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "../components/Footer";




function BMICalculator() {
  // useSTATES
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [categoryColor, setCategoryColor] = useState("white");
  const [time, setTime] = useState(new Date());
  const today = new Date().toLocaleDateString();
  const [history, setHistory] = useState([]);

  // calculatebmi function
  const calculateBMI = () => {
    if (!height || !weight || height <= 0 || weight <= 0) {
      alert("Please enter valid Height and Weight");
      return;
    }
    const h = height / 100;
    const bmiValue = (weight / (h * h)).toFixed(2);

    let newCategory = "";
    let newMessage = "";

    
    
    // logic for that

    

    if (bmiValue < 18.5) {
      newCategory = "UnderWeight";
      newMessage = "You are UnderWeight ⚠️";
      setCategoryColor("#facc15"); // yellow
    

    }
      
    else if (bmiValue < 25) {
      newCategory = "NormalWeight";
      newMessage = "You are in a Healthy Weight Range 💚 ";
      setCategoryColor("#22c55e"); // green

    }
     

    else if (bmiValue < 30) {
      newCategory = "OverWeight";
      newMessage = "you are OverWeight 🍔";
      setCategoryColor("#f97316"); // orange
      
    }
    

    else {
      newCategory = "Obese";
      newMessage = "Health risk Detected 🚨";
      setCategoryColor("#ef4444"); // red
      
    }
    setBmi(bmiValue);
    setCategory(newCategory);
    setMessage(newMessage);
  

    // histroy saving 

    const updatedHistory = [
      ...history,
      {
        date: today,
        time: time.toLocaleTimeString(),
        bmi: bmiValue,
        category: newCategory
      }
   
    ];
    setHistory(updatedHistory);

    // local storage
    localStorage.setItem("bmiHistory", JSON.stringify(updatedHistory));

   
  };
  // Load history from localStorage on first render
  useEffect(() => {
    const savedHistory = localStorage.getItem("bmiHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);




  // timer logic 
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  
  return (
     
    <div className="page">
      <h1 style={{ fontSize: "22px" }}>
        HEALTH & FITNESS AI DASHBOARD
      </h1>
      <Navbar />

      <div className="bmi-container">
        <div className="form-box">

          <h2 style={{ textAlign: "center" }}>
            BMI CALCULATOR
          </h2>

          <p style={{ textAlign: "center", opacity: "0.7" }}>
            TODAY: {today}
          </p>

          <p style={{ textAlign: "center", opacity: "0.7" }}>
            TIME: {time.toLocaleTimeString()}
          </p>

          <input
            type="number"
            placeholder="HEIGHT (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />

          <input
            type="number"
            placeholder="WEIGHT (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <button
            className="primary-btn"
            onClick={calculateBMI}
            disabled={!height || !weight}
          >
            CALCULATE BMI
          </button>

          {/* RESULT INSIDE SAME BOX */}
          {bmi && (
            <div className="bmi-result">
              <p><strong>BMI :</strong> {bmi}</p>
              <p style={{ color: categoryColor, fontWeight: "bold" }}>
                <strong>Category :</strong> {category}
              </p>
              <p style={{ color: categoryColor }}>
                <strong>Message :</strong> {message}
              </p>
            </div>
          )}

          {/* HISTORY INSIDE SAME BOX */}
          <div className="bmi-history">
            <h3>BMI History</h3>
            <ul>
              {history.map((item, index) => (
                <li key={index}>
                  DATE : {item.date} TIME : {item.time} → BMI: {item.bmi} ({item.category})
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BMICalculator;