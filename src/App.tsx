import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Editor from "./pages/Editor";
import LoadingScreen from "./components/LoadingScreen";
import { useState, useEffect } from "react";
import "./app.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Optional: only show once per browser session
  //   const seen = sessionStorage.getItem("hasSeenLoading");
  //   if (seen === "true") {
  //     setIsLoading(false);
  //     return;
  //   }

  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //     sessionStorage.setItem("hasSeenLoading", "true");
  //   }, 3500);

  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);
  
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;