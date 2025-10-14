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

app.listen(5000, () =>
  console.log(`✅ Backend running at http://localhost:5000`)
);
    