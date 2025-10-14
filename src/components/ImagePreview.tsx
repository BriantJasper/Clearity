import { useEffect, useState } from "react";

interface ImagePreviewProps {
  files: File[];
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ files }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const newImageUrls: string[] = [];
    files.forEach((file) => newImageUrls.push(URL.createObjectURL(file)));
    setImageUrls(newImageUrls);

    // Cleanup function untuk mencegah memory leak
    return () => {
      newImageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  if (files.length === 0) {
    return null;
  }

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

export default ImagePreview;
