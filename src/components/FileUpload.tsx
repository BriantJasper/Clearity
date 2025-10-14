import { useState, type DragEvent, type ChangeEvent } from "react";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  fileCount: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  fileCount,
}) => {
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
    }
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

export default FileUpload;
