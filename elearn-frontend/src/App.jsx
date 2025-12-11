import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FormalLearning from "./pages/FormalLearning";
import NonFormalLearning from "./pages/NonFormalLearning";
import InformalLearning from "./pages/InformalLearning";
import AITutor from "./pages/AITutor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/formal" element={<FormalLearning />} />
        <Route path="/nonformal" element={<NonFormalLearning />} />
        <Route path="/informal" element={<InformalLearning />} />

        <Route path="/ai" element={<AITutor />} />
      </Routes>
    </BrowserRouter>
  );
}
