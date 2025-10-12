// Tipe-tipe untuk opsi pemrosesan
export type ProcessingType = "resize" | "watermark" | "convert" | "filter" | "rotate";
export type ConvertFormatType = "image/jpeg" | "image/png" | "image/webp";
export type FilterType = "grayscale" | "sepia";
export type RotateDegreeType = 90 | 180 | 270;

// Interface untuk menampung semua state opsi
export interface ProcessingOptionsState {
  processingType: ProcessingType;
  resizeWidth: number;
  watermarkText: string;
  convertFormat: ConvertFormatType;
  filterType: FilterType;
  rotateDegree: RotateDegreeType;
}
