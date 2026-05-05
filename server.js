import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { submitAiRequest } from "./api/AIModel.js";

const PORT = process.env.PORT || 8001;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "dist");

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_PORT,
  }),
);

const rawBodyParser = express.raw({ type: "*/*", limit: "10mb" });

app.post("/api/openai", rawBodyParser, async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Server is missing OPENAI_API_KEY environment variable.",
      });
    }

    if (!process.env.OPENAI_MODEL) {
      return res.status(500).json({
        error: "Server is missing OPENAI_MODEL environment variable.",
      });
    }

    const buffer = req.body; // this is your binary data
    const encodedBlob = buffer.toString("base64"); // this will print the base64 string representation of the binary data
    const dataURL = `data:image/png;base64,${encodedBlob}`;
    const harmfulIngredients = await submitAiRequest(dataURL);
    res.json(harmfulIngredients);
  } catch (error) {
    console.error("Error in /api/openai:", error);
    res.status(500).json({
      error: error?.message || "Unexpected server error while analyzing image.",
    });
  }
});

app.use(express.json());

app.get("/test", (req, res) => {
  res.json("successful response");
});

// Serve Vite build output on Render (and other Node hosts).
app.use(express.static(distPath));

// SPA fallback so routes like /, /about, etc. all return index.html.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => console.log(`Server starting on port ${PORT}`));
