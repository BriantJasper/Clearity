import { useState } from "react";
import axios from "axios";

export default function SuperResolution() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState("2");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const enhance = async () => {
    if (!image) return alert("Please upload an image first!");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("scale", scale);

    try {
      // ✅ FIX: Use full backend URL
      const response = await axios.post(
        "http://localhost:5000/api/super-resolution",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(response.data);
      setResult(url);
    } catch (err) {
      console.error(err);
      alert("Enhancement failed. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">AI Super Resolution</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <div className="flex gap-4 items-center">
        <label>Scale:</label>
        <select
          value={scale}
          onChange={(e) => setScale(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="2">2×</option>
          <option value="4">4×</option>
        </select>
      </div>

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-64 rounded-lg shadow border"
        />
      )}

      <button
        onClick={enhance}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Enhancing..." : "Enhance Image"}
      </button>

      {result && (
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-medium">Enhanced Image</h2>
          <img
            src={result}
            alt="enhanced"
            className="w-64 rounded-lg shadow border"
          />
        </div>
      )}
    </div>
  );
}
