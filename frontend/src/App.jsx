import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Signup from "./pages/Signup";
import  BMICalculator  from "./pages/BMICalculator";
import Dashboard from "./pages/Dashboard";
import Recipe from "./pages/Recipe";
import Workout from "./pages/Workout";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import OAuthSuccess from "./pages/OAuthSuccess";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";


function App() {
  return (
    <Routes>
      

      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/bmi" element={<BMICalculator />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/recipe" element={<ProtectedRoute><Recipe /></ProtectedRoute>} />
      <Route path="/workout" element={<ProtectedRoute><Workout /></ProtectedRoute>}/>

      
    </Routes>

  );
}
export default App;