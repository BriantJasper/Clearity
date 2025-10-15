import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";
import Replicate from "replicate";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
const upload = multer({ dest: "uploads/" });

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
  console.log("🟢 Created uploads folder");
}

// API keys
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

// ------------------------------
// 🟩 Remove Background Endpoint
// ------------------------------
app.post("/api/remove-bg", upload.single("image"), async (req, res) => {
  const filePath = req.file.path;
  try {
    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(filePath));
    formData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": REMOVE_BG_API_KEY },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Remove.bg Error:", errorText);
      return res.status(response.status).send(errorText);
    }

    const buffer = await response.arrayBuffer();
    res.set("Content-Type", "image/png");
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    fs.unlinkSync(filePath);
  }
});

// ------------------------------
// 🟦 Super-Resolution Endpoint (Replicate)
// ------------------------------
app.post("/api/super-resolution", upload.single("image"), async (req, res) => {
  try {
    console.log("🟢 /api/super-resolution called (Replicate)");

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    if (!REPLICATE_API_TOKEN) {
      console.error("❌ REPLICATE_API_TOKEN not found in .env");
      return res
        .status(500)
        .json({ error: "Replicate API token not configured" });
    }

    const scale = req.body.scale || "2";
    console.log(`📐 Scale factor: ${scale}x`);

    // Read and convert to base64
    const fileBuffer = fs.readFileSync(req.file.path);
    const base64Image = `data:image/png;base64,${fileBuffer.toString(
      "base64"
    )}`;

    console.log("✅ Image loaded, sending to Replicate...");

    // Use Replicate for super-resolution
    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: base64Image,
          scale: parseInt(scale),
          face_enhance: false,
        },
      }
    );

    console.log("✅ Processing complete, fetching result...");

    // Fetch the result image
    const imageResponse = await fetch(output);
    if (!imageResponse.ok) {
      throw new Error("Failed to fetch processed image");
    }

    const result = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(result);

    fs.unlinkSync(req.file.path); // Clean up file
    res.set("Content-Type", "image/png");
    res.send(buffer);

    console.log("✅ Image enhancement complete!");
  } catch (error) {
    console.error("❌ Server Error:", error);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// 🟨 Object Removal Endpoint (Clipdrop)
// ------------------------------
app.post(
  "/api/remove-object",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "mask", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("🟢 /api/remove-object called (Clipdrop)");

      if (!req.files || !req.files.image || !req.files.mask) {
        return res.status(400).json({ error: "Image and mask required" });
      }

      if (!CLIPDROP_API_KEY) {
        console.error("❌ CLIPDROP_API_KEY not found in .env");
        return res
          .status(500)
          .json({ error: "Clipdrop API key not configured" });
      }

      const imagePath = req.files.image[0].path;
      const maskPath = req.files.mask[0].path;

      const formData = new FormData();
      formData.append("image_file", fs.createReadStream(imagePath));
      formData.append("mask_file", fs.createReadStream(maskPath));

      console.log("✅ Sending to Clipdrop API...");

      const response = await fetch("https://clipdrop-api.co/cleanup/v1", {
        method: "POST",
        headers: {
          "x-api-key": CLIPDROP_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Clipdrop Error:", errorText);
        fs.unlinkSync(imagePath);
        fs.unlinkSync(maskPath);
        return res.status(response.status).send(errorText);
      }

      const buffer = await response.arrayBuffer();

      // Clean up uploaded files
      fs.unlinkSync(imagePath);
      fs.unlinkSync(maskPath);

      res.set("Content-Type", "image/png");
      res.send(Buffer.from(buffer));

      console.log("✅ Object removal complete!");
    } catch (error) {
      console.error("❌ Server Error:", error);

      // Clean up files if they exist
      if (req.files) {
        if (req.files.image) fs.unlinkSync(req.files.image[0].path);
        if (req.files.mask) fs.unlinkSync(req.files.mask[0].path);
      }

      res.status(500).json({ error: error.message });
    }
  }
);

// ------------------------------
// 🟪 Image Upscaling Endpoint (Clipdrop)
// ------------------------------
app.post("/api/upscale-image", upload.single("image"), async (req, res) => {
  try {
    console.log("🟢 /api/upscale-image called (Clipdrop)");

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    if (!CLIPDROP_API_KEY) {
      console.error("❌ CLIPDROP_API_KEY not found in .env");
      return res.status(500).json({ error: "Clipdrop API key not configured" });
    }

    const targetWidth = req.body.target_width || "2048";
    const targetHeight = req.body.target_height || "2048";

    console.log(`📐 Target dimensions: ${targetWidth}x${targetHeight}`);

    const imagePath = req.file.path;

    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(imagePath));
    formData.append("target_width", targetWidth);
    formData.append("target_height", targetHeight);

    console.log("✅ Sending to Clipdrop Upscaling API...");

    const response = await fetch(
      "https://clipdrop-api.co/image-upscaling/v1/upscale",
      {
        method: "POST",
        headers: {
          "x-api-key": CLIPDROP_API_KEY,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Clipdrop Upscaling Error:", errorText);
      fs.unlinkSync(imagePath);
      return res.status(response.status).send(errorText);
    }

    const buffer = await response.arrayBuffer();

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    // Set appropriate content type based on response
    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.set("Content-Type", contentType);
    res.send(Buffer.from(buffer));

    console.log("✅ Image upscaling complete!");
  } catch (error) {
    console.error("❌ Server Error:", error);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// 🟧 Product Photography Endpoint (Clipdrop)
// ------------------------------
app.post(
  "/api/product-photography",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("🟢 /api/product-photography called (Clipdrop)");

      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      if (!CLIPDROP_API_KEY) {
        console.error("❌ CLIPDROP_API_KEY not found in .env");
        return res
          .status(500)
          .json({ error: "Clipdrop API key not configured" });
      }

      const imagePath = req.file.path;

      // Get optional parameters with defaults
      const backgroundColor = req.body.background_color || "#ffffff";
      const lightTheta = req.body.light_theta || "20";
      const lightPhi = req.body.light_phi || "0";
      const lightSize = req.body.light_size || "1.7";
      const shadowDarkness = req.body.shadow_darkness || "0.7";

      console.log(`🎨 Background: ${backgroundColor}`);
      console.log(
        `💡 Light settings: θ=${lightTheta}°, φ=${lightPhi}°, size=${lightSize}, darkness=${shadowDarkness}`
      );

      const formData = new FormData();
      formData.append("image_file", fs.createReadStream(imagePath));
      formData.append("background_color_choice", backgroundColor);
      formData.append("light_theta", lightTheta);
      formData.append("light_phi", lightPhi);
      formData.append("light_size", lightSize);
      formData.append("shadow_darkness", shadowDarkness);

      console.log("✅ Sending to Clipdrop Product Photography API...");

      const response = await fetch(
        "https://clipdrop-api.co/product-photography/v1",
        {
          method: "POST",
          headers: {
            "x-api-key": CLIPDROP_API_KEY,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Clipdrop Product Photography Error:", errorText);
        fs.unlinkSync(imagePath);
        return res.status(response.status).send(errorText);
      }

      const buffer = await response.arrayBuffer();

      // Clean up uploaded file
      fs.unlinkSync(imagePath);

      res.set("Content-Type", "image/jpeg");
      res.send(Buffer.from(buffer));

      console.log("✅ Product photography complete!");
    } catch (error) {
      console.error("❌ Server Error:", error);

      // Clean up file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({ error: error.message });
    }
  }
);

// ------------------------------
// 🟦 Replace Background Endpoint (Clipdrop)
// ------------------------------
app.post(
  "/api/replace-background",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("🟢 /api/replace-background called (Clipdrop)");

      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      if (!CLIPDROP_API_KEY) {
        console.error("❌ CLIPDROP_API_KEY not found in .env");
        return res
          .status(500)
          .json({ error: "Clipdrop API key not configured" });
      }

      const imagePath = req.file.path;
      const prompt = req.body.prompt || "professional studio background";

      console.log(`🎨 Prompt: ${prompt}`);

      const formData = new FormData();
      formData.append("image_file", fs.createReadStream(imagePath));
      formData.append("prompt", prompt);

      console.log("✅ Sending to Clipdrop Replace Background API...");

      const response = await fetch(
        "https://clipdrop-api.co/replace-background/v1",
        {
          method: "POST",
          headers: {
            "x-api-key": CLIPDROP_API_KEY,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Clipdrop Replace Background Error:", errorText);
        fs.unlinkSync(imagePath);
        return res.status(response.status).send(errorText);
      }

      const buffer = await response.arrayBuffer();

      // Clean up uploaded file
      fs.unlinkSync(imagePath);

      res.set("Content-Type", "image/jpeg");
      res.send(Buffer.from(buffer));

      console.log("✅ Background replacement complete!");
    } catch (error) {
      console.error("❌ Server Error:", error);

      // Clean up file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({ error: error.message });
    }
  }
);

// Add this endpoint to your server.js file

// ------------------------------
// 🟩 Text to Image Endpoint (Clipdrop)
// ------------------------------
app.post("/api/text-to-image", express.json(), async (req, res) => {
  try {
    console.log("🟢 /api/text-to-image called (Clipdrop)");

    if (!req.body.prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!CLIPDROP_API_KEY) {
      console.error("❌ CLIPDROP_API_KEY not found in .env");
      return res.status(500).json({ error: "Clipdrop API key not configured" });
    }

    const prompt = req.body.prompt;
    console.log(`🎨 Prompt: ${prompt}`);

    const formData = new FormData();
    formData.append("prompt", prompt);

    console.log("✅ Sending to Clipdrop Text-to-Image API...");

    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": CLIPDROP_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Clipdrop Text-to-Image Error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const buffer = await response.arrayBuffer();

    res.set("Content-Type", "image/jpeg");
    res.send(Buffer.from(buffer));

    console.log("✅ Image generation complete!");
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// 🎬 Video Generation Endpoint (Gemini Veo 3)
// ------------------------------
app.post("/api/generate-video", express.json(), async (req, res) => {
  try {
    console.log("🟢 /api/generate-video called (Gemini Veo 3)");

    if (!req.body.prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not found in .env");
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    const prompt = req.body.prompt;
    const aspectRatio = req.body.aspectRatio || "16:9";
    const modelName = req.body.model || "veo-3.0-generate-preview"; // or "veo-3-fast.0-generate-preview"

    console.log(`🎬 Prompt: ${prompt}`);
    console.log(`📐 Aspect Ratio: ${aspectRatio}`);
    console.log(`🤖 Model: ${modelName}`);

    // Step 1: Start video generation job
    const generateResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predictLongRunning`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: prompt,
            },
          ],
          parameters: {
            aspectRatio: aspectRatio,
            // Optional: Add negative prompt if provided
            ...(req.body.negativePrompt && {
              negativePrompt: req.body.negativePrompt,
            }),
          },
        }),
      }
    );

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error("Gemini API Error:", errorText);
      return res.status(generateResponse.status).json({
        error: errorText || "Failed to generate video",
      });
    }

    const generateData = await generateResponse.json();
    const operationName = generateData.name;

    if (!operationName) {
      throw new Error("No operation name returned from API");
    }

    console.log(`✅ Video generation started. Operation: ${operationName}`);

    // Step 2: Poll for completion
    let isDone = false;
    let videoUri = null;
    let attempts = 0;
    const maxAttempts = 60; // 10 minutes max (10 sec intervals)

    while (!isDone && attempts < maxAttempts) {
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds

      const statusResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${operationName}`,
        {
          method: "GET",
          headers: {
            "x-goog-api-key": GEMINI_API_KEY,
          },
        }
      );

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error("Status check error:", errorText);
        continue;
      }

      const statusData = await statusResponse.json();
      console.log(`⏳ Attempt ${attempts}: Checking status...`);

      if (statusData.done === true) {
        isDone = true;

        if (
          statusData.response &&
          statusData.response.generateVideoResponse &&
          statusData.response.generateVideoResponse.generatedSamples &&
          statusData.response.generateVideoResponse.generatedSamples[0]
        ) {
          videoUri =
            statusData.response.generateVideoResponse.generatedSamples[0].video
              .uri;
          console.log(`✅ Video ready! URI: ${videoUri}`);
        } else if (statusData.error) {
          throw new Error(JSON.stringify(statusData.error));
        } else {
          throw new Error("Video generation completed but no video URI found");
        }
      }
    }

    if (!videoUri) {
      throw new Error("Video generation timed out or failed");
    }

    // Step 3: Download the video
    console.log("📥 Downloading video...");
    const videoResponse = await fetch(videoUri, {
      method: "GET",
      headers: {
        "x-goog-api-key": GEMINI_API_KEY,
      },
    });

    if (!videoResponse.ok) {
      throw new Error("Failed to download video");
    }

    const videoBuffer = await videoResponse.arrayBuffer();

    res.set("Content-Type", "video/mp4");
    res.send(Buffer.from(videoBuffer));

    console.log("✅ Video generation complete and sent to client!");
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// 🎬 Get Video Generation Status (Optional - for checking manually)
// ------------------------------
app.get("/api/video-status/:operationId", async (req, res) => {
  try {
    const operationId = req.params.operationId;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${operationId}`,
      {
        method: "GET",
        headers: {
          "x-goog-api-key": GEMINI_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Status Check Error:", error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(5000, () =>
  console.log(`✅ Backend running at http://localhost:5000`)
);
