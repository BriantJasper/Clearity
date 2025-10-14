import { useState, useCallback } from "react";

export default function RemoveBackground() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Handle image selection
  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setOutput(null);
    } else {
      alert("Please upload a valid image file");
    }
  };

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  }, []);

  // Call backend API
  const handleRemoveBg = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      const blob = await response.blob();
      setOutput(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      alert("Something went wrong while processing the image!");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // The "?" safely handles possible null
    if (file) {
      handleFileChange(file);
    } else {
      alert("No file selected or invalid input");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col items-center gap-4 relative">
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">
          Remove Image Background
        </h1>

        {/* Upload zone */}
        <form
          onDragEnter={handleDrag}
          onSubmit={(e) => e.preventDefault()}
          className={`relative border-2 ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-dashed border-gray-300"
          } rounded-lg p-6 w-full text-center transition`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            id="upload-input"
          />
          <label htmlFor="upload-input" className="cursor-pointer block">
            <p className="text-gray-600">
              {preview ? "Change Image" : "Drag & Drop or Click to Upload"}
            </p>
            <p className="text-sm text-gray-400">(JPG, PNG, etc.)</p>
          </label>

          {dragActive && (
            <div
              className="absolute inset-0 bg-blue-100 bg-opacity-30 rounded-lg border-2 border-blue-400"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            />
          )}
        </form>

        {/* Image preview */}
        {preview && (
          <div className="w-full flex flex-col items-center mt-3">
            <p className="text-gray-600 mb-2 text-sm">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="max-w-full rounded-lg shadow-md mb-3"
            />
          </div>
        )}

        {/* Remove Background button */}
        <button
          onClick={handleRemoveBg}
          disabled={loading || !image}
          className={`px-4 py-2 rounded-lg text-white font-medium transition ${
            loading || !image
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Remove Background"}
        </button>

        {/* Output result */}
        {output && (
          <div className="mt-6 w-full text-center">
            <p className="text-gray-600 mb-2 text-sm">Result:</p>
            <img
              src={output}
              alt="Result"
              className="max-w-full rounded-lg shadow-md mx-auto"
            />
            <a
              href={output}
              download="no-bg.png"
              className="block mt-3 text-blue-600 hover:underline"
            >
              ⬇️ Download Result
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
