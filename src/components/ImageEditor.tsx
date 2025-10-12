// src/components/ImageEditor.tsx

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "tui-image-editor/dist/tui-image-editor.css";
import "../css/ImageEditor.css"; // Make sure to import your CSS

export default function ImageEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  // State to hold the DOM element of the editor's header
  const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const initEditor = async () => {
      const ImageEditor = (await import("tui-image-editor")).default;

      if (editorRef.current && !instanceRef.current) {
        // Initialize the editor
        instanceRef.current = new ImageEditor(editorRef.current, {
          // --- Your editor config remains the same ---
          includeUI: {
            loadImage: {
              path: "https://picsum.photos/800/600",
              name: "SampleImage",
            },
            theme: {},
            menu: [
              "crop",
              "flip",
              "rotate",
              "draw",
              "shape",
              "icon",
              "text",
              "mask",
              "filter",
            ],
            initMenu: "filter",
            uiSize: { width: "100%", height: "700px" },
            menuBarPosition: "bottom",
          },
          cssMaxWidth: 1000,
          cssMaxHeight: 800,
        });

        // --- KEY CHANGE: Find the header and store it in state ---
        // We use a small delay to ensure the UI is fully rendered
        setTimeout(() => {
          const header = document.querySelector(
            ".tui-image-editor-header-buttons"
          ) as HTMLElement | null;
          if (header) {
            setHeaderEl(header);
          }
        }, 100); // 100ms delay is usually enough
      }
    };

    initEditor();

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-[700px] bg-gray-100">
      <div ref={editorRef} className="h-full" />

      {/* --- RENDER THE CUSTOM BUTTONS INTO THE HEADER USING A PORTAL --- */}
      {/* This will only render after headerEl is found and set in state */}
    </div>
  );
}
