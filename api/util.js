const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || "";
import DOMPurify from "dompurify";

// function to encode blob image to base64 for OpenAI sdk
export const convertBLobToBase64 = async (imageBlob) => {
  const blobToBase64 = async (imageBlob) => {
    const arrayBuffer = await imageBlob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
    return `data:${imageBlob.type};base64,${btoa(binary)}`;
  };

  const base64Str = await blobToBase64(imageBlob);
  return base64Str;
};

export const postIdentifyHarmfulIngredients = async (blob) => {
  try {
    const response = await fetch(VITE_BASE_URL + "/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "image/png",
      },
      body: blob,
    });

    const rawResponse = await response.text();
    let result;

    try {
      result = JSON.parse(rawResponse);
    } catch {
      throw new Error(rawResponse || "Server returned an unreadable response.");
    }

    if (!response.ok) {
      throw new Error(result?.error || "Image analysis request failed.");
    }

    const sanitizedResult = DOMPurify.sanitize(result);
    // window.sanitizedResult = sanitizedResult; // for debugging
    return sanitizedResult;
  } catch (error) {
    console.error("Error in postIdentifyHarmfulIngredients:", error);
    throw error;
  }
};
