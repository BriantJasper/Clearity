import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ImageEditor from "./components/ImageEditor";
import "./app.css";
import BatchProcessor from "./components/BatchProcessor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<ImageEditor />} />
        <Route path="/batch" element={<BatchProcessor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
