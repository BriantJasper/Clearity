import {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
  type DragEvent,
} from "react";
import JSZip from "jszip";
import { LoaderCircle, Download, UploadCloud, Settings } from "lucide-react";

//==========================================================================
// 1. DEFINISI TIPE
//==========================================================================
type ProcessingType = "resize" | "watermark" | "convert" | "filter" | "rotate";
type ConvertFormatType = "image/jpeg" | "image/png" | "image/webp";
type FilterType = "grayscale" | "sepia";
type RotateDegreeType = 90 | 180 | 270;

interface ProcessingOptionsState {
  processingType: ProcessingType;
  resizeWidth: number;
  watermarkText: string;
  convertFormat: ConvertFormatType;
  filterType: FilterType;
  rotateDegree: RotateDegreeType;
}

//==========================================================================
// 2. FUNGSI UTILITAS GAMBAR
//==========================================================================
const resizeImage = (file: File, width: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    img.onload = () => {
      const aspectRatio = img.height / img.width;
      const height = width * aspectRatio;
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas to Blob conversion failed"));
        },
        file.type,
        0.95
      );
      URL.revokeObjectURL(img.src);
    };
    img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

const addWatermark = (file: File, text: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const fontSize = Math.max(24, Math.floor(img.width / 25));
      ctx!.font = `bold ${fontSize}px Arial`;
      ctx!.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx!.textAlign = "right";
      ctx!.textBaseline = "bottom";
      ctx?.fillText(text, canvas.width - 20, canvas.height - 20);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas to Blob conversion failed"));
        },
        file.type,
        0.95
      );
      URL.revokeObjectURL(img.src);
    };
    img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

const convertImageFormat = (
  file: File,
  format: ConvertFormatType
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas to Blob conversion failed"));
        },
        format,
        0.95
      );
      URL.revokeObjectURL(img.src);
    };
    img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

const applyFilter = (file: File, filter: FilterType): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (filter === "grayscale") {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        } else if (filter === "sepia") {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
      }
      ctx!.putImageData(imageData, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas to Blob conversion failed"));
        },
        file.type,
        0.95
      );
      URL.revokeObjectURL(img.src);
    };
    img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

const rotateImage = (file: File, degrees: RotateDegreeType): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    img.onload = () => {
      const rads = (degrees * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rads));
      const cos = Math.abs(Math.cos(rads));
      const newWidth = img.width * cos + img.height * sin;
      const newHeight = img.width * sin + img.height * cos;
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx!.translate(newWidth / 2, newHeight / 2);
      ctx!.rotate(rads);
      ctx?.drawImage(img, -img.width / 2, -img.height / 2);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas to Blob conversion failed"));
        },
        file.type,
        0.95
      );
      URL.revokeObjectURL(img.src);
    };
    img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

//==========================================================================
// 3. KOMPONEN-KOMPONEN ANAK
//==========================================================================
const FileUpload: React.FC<{
  onFilesSelected: (files: File[]) => void;
  fileCount: number;
}> = ({ onFilesSelected, fileCount }) => {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0)
      onFilesSelected(Array.from(e.dataTransfer.files));
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onFilesSelected(Array.from(e.target.files));
  };

  return (
    <label
      htmlFor="file-upload"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition ${
        isDragging
          ? "border-indigo-600 bg-indigo-50"
          : "border-slate-300 bg-slate-50 hover:bg-slate-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
        <p className="mb-2 text-sm text-slate-500">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        {fileCount > 0 ? (
          <p className="text-xs text-green-600 font-medium">
            {fileCount} image(s) selected
          </p>
        ) : (
          <p className="text-xs text-slate-400">PNG, JPG, WEBP, etc.</p>
        )}
      </div>
      <input
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
  );
};

const ImagePreview: React.FC<{ files: File[] }> = ({ files }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  useEffect(() => {
    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setImageUrls(newImageUrls);
    return () => {
      newImageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);
  if (files.length === 0) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-700 mb-3">
        Image Preview
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4 border rounded-lg bg-slate-50 max-h-60 overflow-y-auto">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className="aspect-square w-full rounded-md overflow-hidden ring-2 ring-slate-200"
          >
            <img
              src={url}
              alt={`Preview ${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ProcessingOptions: React.FC<{
  onOptionsChange: (options: ProcessingOptionsState) => void;
}> = ({ onOptionsChange }) => {
  const [options, setOptions] = useState<ProcessingOptionsState>({
    processingType: "resize",
    resizeWidth: 1024,
    watermarkText: "© My Website",
    convertFormat: "image/jpeg",
    filterType: "grayscale",
    rotateDegree: 90,
  });
  useEffect(() => {
    onOptionsChange(options);
  }, [options, onOptionsChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-slate-600" />
        <h2 className="text-xl font-semibold text-slate-700">
          Processing Options
        </h2>
      </div>
      <div className="p-4 border rounded-lg bg-slate-50 space-y-4">
        <div>
          <label
            htmlFor="processing-type"
            className="block mb-2 text-sm font-medium text-slate-700"
          >
            Process Type
          </label>
          <select
            id="processing-type"
            value={options.processingType}
            onChange={(e) =>
              setOptions((p) => ({
                ...p,
                processingType: e.target.value as ProcessingType,
              }))
            }
            className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          >
            <option value="resize">Resize</option>
            <option value="watermark">Add Watermark</option>
            <option value="convert">Convert Format</option>
            <option value="filter">Apply Filter</option>
            <option value="rotate">Rotate</option>
          </select>
        </div>
        {options.processingType === "resize" && (
          <div>
            <label
              htmlFor="resize-width"
              className="block mb-2 text-sm font-medium text-slate-700"
            >
              Width (pixels)
            </label>
            <input
              type="number"
              id="resize-width"
              value={options.resizeWidth}
              onChange={(e) =>
                setOptions((p) => ({
                  ...p,
                  resizeWidth: parseInt(e.target.value, 10) || 0,
                }))
              }
              className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
        )}
        {options.processingType === "watermark" && (
          <div>
            <label
              htmlFor="watermark-text"
              className="block mb-2 text-sm font-medium text-slate-700"
            >
              Watermark Text
            </label>
            <input
              type="text"
              id="watermark-text"
              value={options.watermarkText}
              onChange={(e) =>
                setOptions((p) => ({ ...p, watermarkText: e.target.value }))
              }
              className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
        )}
        {options.processingType === "convert" && (
          <div>
            <label
              htmlFor="convert-format"
              className="block mb-2 text-sm font-medium text-slate-700"
            >
              New Format
            </label>
            <select
              id="convert-format"
              value={options.convertFormat}
              onChange={(e) =>
                setOptions((p) => ({
                  ...p,
                  convertFormat: e.target.value as ConvertFormatType,
                }))
              }
              className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            >
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WEBP</option>
            </select>
          </div>
        )}
        {options.processingType === "filter" && (
          <div>
            <label
              htmlFor="filter-type"
              className="block mb-2 text-sm font-medium text-slate-700"
            >
              Filter Type
            </label>
            <select
              id="filter-type"
              value={options.filterType}
              onChange={(e) =>
                setOptions((p) => ({
                  ...p,
                  filterType: e.target.value as FilterType,
                }))
              }
              className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            >
              <option value="grayscale">Grayscale</option>
              <option value="sepia">Sepia</option>
            </select>
          </div>
        )}
        {options.processingType === "rotate" && (
          <div>
            <label
              htmlFor="rotate-degree"
              className="block mb-2 text-sm font-medium text-slate-700"
            >
              Rotation Angle
            </label>
            <select
              id="rotate-degree"
              value={options.rotateDegree}
              onChange={(e) =>
                setOptions((p) => ({
                  ...p,
                  rotateDegree: parseInt(
                    e.target.value,
                    10
                  ) as RotateDegreeType,
                }))
              }
              className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            >
              <option value={90}>90 Degrees</option>
              <option value={180}>180 Degrees</option>
              <option value={270}>270 Degrees</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

//==========================================================================
// 4. KOMPONEN UTAMA
//==========================================================================
const BatchProcessor = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<ProcessingOptionsState | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedCount, setProcessedCount] = useState<number>(0);

  const handleProcessImages = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0 || !options) {
      alert("Please select files and ensure options are set.");
      return;
    }

    setIsProcessing(true);
    setProcessedCount(0);
    const zip = new JSZip();

    const processingPromises = files.map(async (file) => {
      try {
        let processedBlob: Blob;
        switch (options.processingType) {
          case "resize":
            processedBlob = await resizeImage(file, options.resizeWidth);
            break;
          case "watermark":
            processedBlob = await addWatermark(file, options.watermarkText);
            break;
          case "convert":
            processedBlob = await convertImageFormat(
              file,
              options.convertFormat
            );
            break;
          case "filter":
            processedBlob = await applyFilter(file, options.filterType);
            break;
          case "rotate":
            processedBlob = await rotateImage(file, options.rotateDegree);
            break;
          default:
            throw new Error("Invalid processing type");
        }

        const fileExtension =
          (options.processingType === "convert"
            ? options.convertFormat.split("/")[1]
            : file.name.split(".").pop()) || "jpg";
        const newFileName =
          file.name.replace(/\.[^/.]+$/, "") + `.${fileExtension}`;
        zip.file(newFileName, processedBlob);
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
      } finally {
        setProcessedCount((prev) => prev + 1);
      }
    });

    await Promise.all(processingPromises);

    zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "processed-images.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    });

    setIsProcessing(false);
    setFiles([]); // Kosongkan file setelah selesai
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Batch Image Processor
          </h1>
          <p className="text-slate-500 mt-2">
            Upload, preview, process, and download multiple images instantly.
          </p>
        </div>

        <form onSubmit={handleProcessImages} className="space-y-8">
          <FileUpload onFilesSelected={setFiles} fileCount={files.length} />
          <ImagePreview files={files} />
          <ProcessingOptions onOptionsChange={setOptions} />

          <div>
            <button
              type="submit"
              disabled={isProcessing || files.length === 0}
              className="w-full flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-3 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" />{" "}
                  Processing... ({processedCount}/{files.length})
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" /> Process & Download
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchProcessor;
