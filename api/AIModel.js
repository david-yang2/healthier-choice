import "dotenv/config";
import OpenAI from "openai";

export const submitAiRequest = async (base64EncodedImg) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  const messages = [
    {
      role: "system",
      content: `You are nutritionist who only cares about the ingredients in the food label. Your sole task is to highlight the ingredients that are not in compliance to the EU Commision's Food Saftey Policy. Your response should be formated as an array of JSON objects. The first object should be an array of all ingredients. The second object should be an array of harmful ingredients. Each Object should include the name of the ingredient, rating (which can be either 'banned' or 'caution') and a brief description of why it's harmful. The description should be a maximum of 2 sentences. If no ingredients are given, you should throw an error by responding with a JSON object that includes an error message. Here are some examples of how you should respond:

      Here is an example of the format of your response if ingredients are given:
      [
        {"ingredients": ["Sugar", "Salt", "Titanium Dioxide", "Confectioner's Glaze (Lac Resin)", "Palm Kernel Oil"]},
        {"harmful_ingredients": [
          {
            "ingredient": "Titanium Dioxide",
            "rating": "banned",
            "description": "Titanium dioxide (E 171) is banned in the EU as a food additive due to concerns over its potential genotoxicity and impact on the immune system."
          },
          {
          "ingredient": "Confectioner's Glaze (Lac Resin)",
          "rating": "caution",
          "description": "Confectioner's glaze, also known as shellac, is derived from the resinous secretions of the lac bug and may cause allergic reactions in some individuals."
          },
          {
            "ingredient": "Palm Kernel Oil",
            "rating": "caution",
            "description": "While not banned, palm kernel oil is scrutinized for its environmental impact and potential health effects due to high saturated fat content."
          }
          ]},
      ]
      
      Here is an example of your response if no ingredients are given:
      {"error": "Sorry I do not see any food label or ingredients listed. Please retake the picture of the food label. Once you provide the ingredients, I can assist you in identifying any potential non-compliance with EU Commission's Food Safety Policy and provide a response in the format you requested."}
        `,
    },
  ];

  // user prompt
  messages.push({
    role: "user",
    content: [
      {
        type: "text",
        text: "",
      },
      {
        type: "image_url",
        image_url: {
          url: base64EncodedImg,
        },
      },
    ],
  });
  
  const aiResponse = client.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages,
    temperature: 1,
    top_p: 1,
    stop: null,
  });
  try {
    const response = await aiResponse;
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in submitAiRequest:", error);
    throw error;
  }
};



