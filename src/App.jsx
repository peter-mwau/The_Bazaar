import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer
        position="bottom-right" // Bottom right usually feels more like a "system notification" in 3D UIs
        autoClose={4000}
        hideProgressBar={true} // Cleaner look
        newestOnTop={true}
        closeOnClick
        theme="dark" // Base dark theme
        toastClassName="custom-toast" // Link to your CSS above
      />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
