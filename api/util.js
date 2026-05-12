const RAW_BASE_URL = (import.meta.env.VITE_BASE_URL || "").trim();
import DOMPurify from "dompurify";

const getApiUrl = () => {
  // In production, ignore localhost-style base URLs and use same-origin API path.
  if (typeof window !== "undefined") {
    const isProdHost = window.location.hostname !== "localhost";
    const isLocalBase = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(
      RAW_BASE_URL,
    );

    if (isProdHost && isLocalBase) {
      return "/api/openai";
    }
  }

  return `${RAW_BASE_URL}/api/openai`;
};

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
    const response = await fetch(getApiUrl(), {
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
    if (response.status === 429) {
      // Prefer backend error message if present
      throw new Error(result?.error || "You are sending requests too quickly. Please wait and try again");
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
