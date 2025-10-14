import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ImageEditor from "./components/ImageEditor";
import "./app.css";
import BatchProcessor from "./components/BatchProcessor";
import StyleTransferRei from "./components/StyleTransferRei";
import RemoveBackground from "./components/RemoveBackground";
import SuperResolution from "./components/SuperResolution";
import ObjectRemoval from "./components/ObjectRemoval";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/about" element={<About />} />
        <Route path="/batch" element={<BatchProcessor />} />
        <Route path="/art" element={<StyleTransferRei />} />
        <Route path="/remove-bg" element={<RemoveBackground />} />
        <Route path="/super-resolution" element={<SuperResolution />} />
        <Route path="/objectremoval" element={<ObjectRemoval />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
