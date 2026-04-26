import "dotenv/config";
import express from "express";
import cors from "cors";
import { submitAiRequest } from "./api/AIModel.js";

const PORT = 8001;
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_PORT,
  }),
);

const rawBodyParser = express.raw({ type: "*/*", limit: "10mb" });

app.post("/api/openai", rawBodyParser, async (req, res) => {
  try {
    const buffer = req.body; // this is your binary data
    const encodedBlob = buffer.toString("base64"); // this will print the base64 string representation of the binary data
    const dataURL = `data:image/png;base64,${encodedBlob}`;
    const harmfulIngredients = await submitAiRequest(dataURL);
    res.json(harmfulIngredients);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

app.use(express.json());

app.get("/test", (req, res) => {
  res.json("successful response");
});

app.listen(PORT, () => console.log(`Server starting on port ${PORT}`));
