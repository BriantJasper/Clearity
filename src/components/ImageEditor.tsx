import { useEffect, useRef } from "react";
import "tui-image-editor/dist/tui-image-editor.css";

export default function ImageEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const ImageEditor = (await import("tui-image-editor")).default;

      if (editorRef.current && !instanceRef.current) {
        instanceRef.current = new ImageEditor(editorRef.current, {
          includeUI: {
            loadImage: {
              path: "https://picsum.photos/800/600",
              name: "SampleImage",
            },
            theme: {}, // You can replace with custom theme
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
            uiSize: {
              width: "100%",
              height: "700px",
            },
            menuBarPosition: "bottom",
          },
          cssMaxWidth: 1000,
          cssMaxHeight: 800,
          selectionStyle: {
            cornerSize: 20,
            rotatingPointOffset: 70,
          },
        });
      }
    })();

    return () => {
      // Clean up when unmounting
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-[700px] bg-gray-100">
      <div ref={editorRef} className="h-full" />
    </div>
  );
}
