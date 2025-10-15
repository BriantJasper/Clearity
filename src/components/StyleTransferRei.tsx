import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Wand2,
  Download,
  Sparkles,
  Image,
  Palette,
  Sliders,
} from "lucide-react";
import * as tf from "@tensorflow/tfjs";
import * as magenta from "@magenta/image";

interface StylePreset {
  id: string;
  name: string;
  src: string;
  gradient: string;
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

  useEffect(() => {
    const load = async () => {
      const net = new magenta.ArbitraryStyleTransferNetwork();
      await net.initialize();
      setModel(net);
      console.log("✅ Model loaded");
    };
    load();
  }, []);

  const stylePresets: StylePreset[] = [
    {
      id: "chinese-ink",
      name: "Chinese Ink",
      src: "/styles/chinese-ink.jpg",
      gradient: "from-gray-700 to-gray-900",
    },
    {
      id: "8bit",
      name: "8 Bit",
      src: "/styles/8bit.jpeg",
      gradient: "from-pink-500 to-purple-600",
    },
    {
      id: "bricks",
      name: "Bricks",
      src: "/styles/bricks.jpg",
      gradient: "from-orange-500 to-red-600",
    },
    {
      id: "stripes",
      name: "Stripes",
      src: "/styles/stripes.jpg",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "udnie",
      name: "Udnie",
      src: "/styles/udnie.jpg",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "zigzag",
      name: "ZigZag",
      src: "/styles/zigzag.jpg",
      gradient: "from-green-500 to-emerald-600",
    },
  ];

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
    if (!model) {
      alert("Model is still loading, please wait...");
      return;
    }

    if (!contentRef.current) {
      alert("Please upload a content image first");
      return;
    }

    if (!styleRef.current) {
      alert("Style image not ready");
      return;
    }

    if (!canvasRef.current) {
      alert("Canvas not ready");
      return;
    }

    // Check if images are actually loaded
    if (!contentRef.current.complete || contentRef.current.naturalWidth === 0) {
      alert("Content image is still loading, please wait...");
      return;
    }

    if (!styleRef.current.complete || styleRef.current.naturalWidth === 0) {
      alert("Style image is still loading, please wait...");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Resize images to canvas
      const resizeImageToCanvas = (img: HTMLImageElement, size: number) => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = size;
        tempCanvas.height = size;
        const ctx = tempCanvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, size, size);
        return tempCanvas;
      };

      const resizedContent = resizeImageToCanvas(
        contentRef.current,
        contentSize
      );
      const resizedStyle = resizeImageToCanvas(styleRef.current, styleSize);

      // Run model stylization
      const stylized = await model.stylize(resizedContent, resizedStyle);

      // Convert result to Tensor for strength interpolation
      let tensor: tf.Tensor3D;
      if (stylized instanceof tf.Tensor) {
        tensor = stylized;
      } else {
        tensor = tf.browser.fromPixels(stylized as ImageData);
      }

      // Interpolate if strength < 1.0
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

      // Display to canvas
      await tf.browser.toPixels(tensor, canvasRef.current);
      setResult(canvasRef.current.toDataURL());
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Failed to apply style transfer");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "styled-image.png";
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-purple-900 mb-1">
              Transform Your Images with Artistic Styles
            </h3>
            <p className="text-sm text-purple-700">
              Apply stunning artistic styles to your photos using AI. Choose
              from presets or upload your own style reference.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Image Upload */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Image className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Content Image</h3>
          </div>
          <label className="relative block group cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleContentUpload}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all group-hover:scale-[1.02]">
              {contentURL ? (
                <div className="space-y-3">
                  <img
                    ref={contentRef}
                    src={contentURL}
                    alt="content"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="text-sm text-gray-600">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">
                      Upload your photo
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Style Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Style Reference</h3>
          </div>

          {/* Style Mode Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setUsePresetStyle(true)}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                usePresetStyle
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Preset Styles
            </button>
            <button
              onClick={() => setUsePresetStyle(false)}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                !usePresetStyle
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Upload Style
            </button>
          </div>

          {usePresetStyle ? (
            <div className="grid grid-cols-3 gap-3">
              {stylePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    selectedPreset === preset.id
                      ? "border-purple-500 shadow-lg"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <img
                    src={preset.src}
                    alt={preset.name}
                    className="w-full h-20 object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${preset.gradient} opacity-20`}
                  ></div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs font-medium text-white text-center">
                      {preset.name}
                    </p>
                  </div>
                  {selectedPreset === preset.id && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <label className="relative block group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleStyleUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all">
                {styleURL ? (
                  <div className="space-y-3">
                    <img
                      ref={styleRef}
                      src={styleURL}
                      alt="style"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600">
                      Click to change style
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Upload style reference
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Any artistic image
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </label>
          )}

          {/* Hidden style image for processing */}
          {usePresetStyle && (
            <img
              ref={styleRef}
              src={stylePresets.find((s) => s.id === selectedPreset)?.src}
              alt="style"
              className="hidden"
              crossOrigin="anonymous"
              onLoad={() => console.log("Preset style image loaded")}
            />
          )}
          {!usePresetStyle && styleURL && (
            <img
              ref={styleRef}
              src={styleURL}
              alt="style"
              className="hidden"
              onLoad={() => console.log("Custom style image loaded")}
            />
          )}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Advanced Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Style Strength
              </label>
              <span className="text-sm font-semibold text-purple-600">
                {strength.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <p className="text-xs text-gray-500">How much style to apply</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Content Size
              </label>
              <span className="text-sm font-semibold text-purple-600">
                {contentSize}px
              </span>
            </div>
            <input
              type="range"
              min="128"
              max="512"
              step="8"
              value={contentSize}
              onChange={(e) => setContentSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <p className="text-xs text-gray-500">Output image size</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Style Size
              </label>
              <span className="text-sm font-semibold text-purple-600">
                {styleSize}px
              </span>
            </div>
            <input
              type="range"
              min="128"
              max="512"
              step="8"
              value={styleSize}
              onChange={(e) => setStyleSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <p className="text-xs text-gray-500">Style processing size</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleApply}
          disabled={loading || !contentURL}
          className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
            loading || !contentURL
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Apply Style Transfer</span>
            </>
          )}
        </button>

        {result && (
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5" />
            <span>Download Result</span>
          </button>
        )}
      </div>

      {/* Hidden canvas for processing */}
      <canvas
        ref={canvasRef}
        width={contentSize}
        height={contentSize}
        className="hidden"
      />

      {/* Result Preview */}
      {result && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Stylized Result
          </h3>
          <div className="bg-white rounded-lg p-4 shadow-inner">
            <img
              src={result}
              alt="Stylized result"
              className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2">
          💡 Tips for Best Results
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use high-quality images for better style transfer results</li>
          <li>
            • Adjust style strength to control how much of the artistic style is
            applied
          </li>
          <li>
            • Experiment with different preset styles to find your favorite look
          </li>
          <li>
            • Higher resolution settings produce better quality but take longer
            to process
          </li>
        </ul>
      </div>
    </div>
  );
}
