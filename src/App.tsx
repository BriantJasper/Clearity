import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import LoadingScreen from "./components/LoadingScreen";
import { useState, useEffect } from "react";
import "./app.css";
import AIFeaturesPage from "./pages/AIFeaturesPage";
import BatchProcessor from "./components/BatchProcessor";
import StyleTransferRei from "./components/StyleTransferRei";
import RemoveBackground from "./components/RemoveBackground";
import SuperResolution from "./components/SuperResolution";
import ObjectRemoval from "./components/ObjectRemoval";
import ProductPhotography from "./components/ProductPhotography";
import ReplaceBackground from "./components/ReplaceBackgroundProps";
import TextToImage from "./components/TextToImage";
import VideoGeneration from "./components/VideoGeneration";
import ImageEditor from "./components/ImageEditor";
import ImageUncrop from "./components/ImageUncrop";
import RemoveText from "./components/RemoveText";

function App() {
  const [isLoading, setIsLoading] = useState(true);

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
        <Route path="/editor" element={<ImageEditor />} />
        <Route path="/about" element={<About />} />
        <Route path="/batch" element={<BatchProcessor />} />
        
        {/* Unified AI Features Page with tabs */}
        <Route path="/ai" element={<AIFeaturesPage />} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/art" element={<StyleTransferRei />} />
        <Route path="/remove-bg" element={<RemoveBackground />} />
        <Route path="/super-resolution" element={<SuperResolution />} />
        <Route path="/objectremoval" element={<ObjectRemoval />} />
        <Route path="/productphotography" element={<ProductPhotography />} />
        <Route path="/replacebackgroundprops" element={<ReplaceBackground />} />
        <Route path="/texttoimage" element={<TextToImage />} />
        <Route path="/videogeneration" element={<VideoGeneration />} />
        <Route path="/remove-text" element={<RemoveText />} />
        <Route path="/imageuncrop" element={<ImageUncrop />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;