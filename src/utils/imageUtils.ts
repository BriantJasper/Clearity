import type { ConvertFormatType, FilterType, RotateDegreeType } from "./types";

// Fungsi helper untuk mengubah ukuran gambar
export const resizeImage = (file: File, width: number): Promise<Blob> => {
  // ... (kode fungsi resizeImage yang sama persis seperti sebelumnya)
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
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas to Blob conversion failed"));
      }, file.type, 0.95);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

// Fungsi helper untuk menambah watermark
export const addWatermark = (file: File, text: string): Promise<Blob> => {
  // ... (kode fungsi addWatermark yang sama persis seperti sebelumnya)
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
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas to Blob conversion failed"));
      }, file.type, 0.95);
      URL.revokeObjectURL(img.src);
    };
     img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};


// Fungsi helper untuk konversi format
export const convertImageFormat = (file: File, format: ConvertFormatType): Promise<Blob> => {
  // ... (kode fungsi convertImageFormat yang sama persis seperti sebelumnya)
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas to Blob conversion failed"));
      }, format, 0.95);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};


// Fungsi helper untuk filter gambar
export const applyFilter = (file: File, filter: FilterType): Promise<Blob> => {
  // ... (kode fungsi applyFilter yang sama persis seperti sebelumnya)
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
          data[i] = avg; data[i + 1] = avg; data[i + 2] = avg;
        } else if (filter === "sepia") {
          const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
      }
      ctx!.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas to Blob conversion failed"));
      }, file.type, 0.95);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};


// Fungsi helper untuk rotasi gambar
export const rotateImage = (file: File, degrees: RotateDegreeType): Promise<Blob> => {
  // ... (kode fungsi rotateImage yang sama persis seperti sebelumnya)
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
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas to Blob conversion failed"));
      }, file.type, 0.95);
      URL.revokeObjectURL(img.src);
    };
     img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};
