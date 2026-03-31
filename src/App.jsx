import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
// import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Navbar />
      {/* <ToastContainer
        position="bottom-right" // Bottom right usually feels more like a "system notification" in 3D UIs
        autoClose={4000}
        hideProgressBar={true} // Cleaner look
        newestOnTop={true}
        closeOnClick
        theme="dark" // Base dark theme
        toastClassName="custom-toast" // Link to your CSS above
      /> */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
