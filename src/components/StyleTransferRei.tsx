import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as magenta from "@magenta/image"; 

interface StylePreset {
  id: string;
  name: string;
  src: string;
}

export default function StyleTransferRei() {
  const [model, setModel] =
    useState<magenta.ArbitraryStyleTransferNetwork | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [contentURL, setContentURL] = useState<string | null>(null);
  const [styleURL, setStyleURL] = useState<string | null>(null);
  const [usePresetStyle, setUsePresetStyle] = useState<boolean>(true);
  const [selectedPreset, setSelectedPreset] = useState<string>("bricks");

  const [strength, setStrength] = useState<number>(1.0);
  const [contentSize, setContentSize] = useState<number>(256);
  const [styleSize, setStyleSize] = useState<number>(256);

  const contentRef = useRef<HTMLImageElement>(null);
  const styleRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stylePresets: StylePreset[] = [
    { id: "chinese-ink", name: "Chinese Ink", src: "/styles/chinese-ink.jpg" },
    { id: "8bit", name: "8 Bit", src: "/styles/8bit.jpeg" },
    { id: "bricks", name: "Bricks", src: "/styles/bricks.jpg" },  
    { id: "stripes", name: "Stripes", src: "/styles/stripes.jpg" },
    { id: "udnie", name: "Udnie", src: "/styles/udnie.jpg" },
    { id: "zigzag", name: "ZigZag", src: "/styles/zigzag.jpg" },
  ];

  useEffect(() => {
    const load = async () => {
      const net = new magenta.ArbitraryStyleTransferNetwork();
      await net.initialize();
      setModel(net);
      console.log("✅ Model loaded");
    };
    load();
  }, []);

  const handleContentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setContentURL(url);
    setResult(null);
  };

  const handleStyleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setStyleURL(url);
    setUsePresetStyle(false);
    setResult(null);
  };

  const handleApply = async () => {
    if (
      !model ||
      !contentRef.current ||
      !styleRef.current ||
      !canvasRef.current
    ) {
      alert("Model atau gambar belum siap");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // 🟢 Resize content image ke canvas sementara
      const resizeImageToCanvas = (img: HTMLImageElement, size: number) => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = size;
        tempCanvas.height = size;
        const ctx = tempCanvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, size, size);
        return tempCanvas;
      };

      const resizedContent = resizeImageToCanvas(
        contentRef.current!,
        contentSize
      );
      const resizedStyle = resizeImageToCanvas(styleRef.current!, styleSize);

      // 🟢 Jalankan model stylization
      const stylized = await model.stylize(resizedContent, resizedStyle);

      // 🟢 Convert hasil ke Tensor untuk interpolasi strength (opsional)
      let tensor: tf.Tensor3D;
      if (stylized instanceof tf.Tensor) {
        tensor = stylized;
      } else {
        tensor = tf.browser.fromPixels(stylized as ImageData);
      }

      // 🟢 Interpolasi jika strength < 1.0
      if (strength < 1.0) {
        const contentTensor = tf.browser.fromPixels(resizedContent);
        let stylTensor = tensor;

        const [ch, cw] = contentTensor.shape.slice(0, 2);
        const [sh, sw] = stylTensor.shape.slice(0, 2);

        if (ch !== sh || cw !== sw) {
          stylTensor = tf.image.resizeBilinear(stylTensor, [ch, cw]);
        }

        tensor = tf.tidy(() => {
          const cont = contentTensor.toFloat().div(tf.scalar(255));
          const styl = stylTensor.toFloat().div(tf.scalar(255));
          const mix = cont
            .mul(tf.scalar(1 - strength))
            .add(styl.mul(tf.scalar(strength)));
          return mix.mul(tf.scalar(255)).toInt() as tf.Tensor3D;
        });
      }

      // 🟢 Tampilkan ke canvas hasil
      await tf.browser.toPixels(tensor, canvasRef.current!);
      setResult(canvasRef.current!.toDataURL());
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Gagal menerapkan style");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "styled.png";
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6">
      <h2 className="text-3xl font-bold text-center mb-4">
        🎨 AI Style Transfer Demo
      </h2>

      {/* === Upload Section === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-semibold">
            Upload Content Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleContentUpload}
            className="block w-full text-sm text-gray-700 border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Select Style</label>
          <div className="flex items-center space-x-3 mb-3">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={usePresetStyle}
                onChange={() => setUsePresetStyle(true)}
              />
              <span>Preset</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={!usePresetStyle}
                onChange={() => setUsePresetStyle(false)}
              />
              <span>Upload</span>
            </label>
          </div>

          {usePresetStyle ? (
            <select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
              className="p-2 border rounded w-full"
            >
              {stylePresets.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleStyleUpload}
              className="block w-full text-sm text-gray-700 border rounded p-2"
            />
          )}
        </div>
      </div>

      {/* === Sliders === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block font-semibold">
            Strength: {strength.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
        <div>
          <label className="block font-semibold">
            Content Size: {contentSize}px
          </label>
          <input
            type="range"
            min="128"
            max="512"
            step="8"
            value={contentSize}
            onChange={(e) => setContentSize(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
        <div>
          <label className="block font-semibold">
            Style Size: {styleSize}px
          </label>
          <input
            type="range"
            min="128"
            max="512"
            step="8"
            value={styleSize}
            onChange={(e) => setStyleSize(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      {/* === Preview Section === */}
      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="font-medium mb-2">Content</p>
          {contentURL ? (
            <img
              ref={contentRef}
              src={contentURL}
              alt="content"
              className="w-48 h-48 object-cover rounded-lg border"
            />
          ) : (
            <div className="w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 mx-auto">
              No Image
            </div>
          )}
        </div>

        <div>
          <p className="font-medium mb-2">Style</p>
          <img
            ref={styleRef}
            src={
              usePresetStyle
                ? stylePresets.find((s) => s.id === selectedPreset)?.src
                : styleURL || ""
            }
            alt="style"
            className="w-48 h-48 object-cover rounded-lg border mx-auto"
          />
        </div>

        <div>
          <p className="font-medium mb-2">Result</p>
          <canvas
            ref={canvasRef}
            width={contentSize}
            height={contentSize}
            className="border rounded-lg shadow mx-auto"
          />
        </div>
      </div>

      {/* === Buttons === */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleApply}
          disabled={loading || !contentURL}
          className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
            loading || !contentURL
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Stylize"}
        </button>

        {result && (
          <button
            onClick={handleDownload}
            className="px-6 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700"
          >
            Download
          </button>
        )}
      </div>
    </div>
  );
}
