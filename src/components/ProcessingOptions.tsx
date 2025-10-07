import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import type {
  ProcessingOptionsState,
  ProcessingType,
  ConvertFormatType,
  FilterType,
  RotateDegreeType,
} from "../utils/types";

interface ProcessingOptionsProps {
  onOptionsChange: (options: ProcessingOptionsState) => void;
}

const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({
  onOptionsChange,
}) => {
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

  const handleTypeChange = (value: ProcessingType) => {
    setOptions((prev) => ({ ...prev, processingType: value }));
  };

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
            onChange={(e) => handleTypeChange(e.target.value as ProcessingType)}
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
                setOptions((prev) => ({
                  ...prev,
                  resizeWidth: parseInt(e.target.value, 10),
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
                setOptions((prev) => ({
                  ...prev,
                  watermarkText: e.target.value,
                }))
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
                setOptions((prev) => ({
                  ...prev,
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
                setOptions((prev) => ({
                  ...prev,
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
                setOptions((prev) => ({
                  ...prev,
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

export default ProcessingOptions;
