import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ImageEditor from "./components/ImageEditor";
import "./app.css";
import BatchProcessor from "./components/BatchProcessor";
import StyleTransferRei from "./components/StyleTransferRei";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<ImageEditor />} />
        <Route path="/batch" element={<BatchProcessor />} />
        <Route path="/art" element={<StyleTransferRei />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
