import "dotenv/config";
import OpenAI from "openai";

export const searchIngredient = async (ingredient) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  const messages = [
    {
      role: "system",
      content: `You are nutritionist and you are given an ingredient. Your sole task is to identify whether or not the ingredient is in compliance to the EU Commision's Food Saftey Policy. Return only a raw JSON object with no markdown, no code fences, and no extra text before or after the JSON. If the ingredient is not in compliance, return a raw JSON object similar to the examples below:
            {
      "ingredient": "Titanium Dioxide",
            "harmful": "true",
      "rating": "banned",
      "description": "Titanium dioxide (E 171) is banned in the EU as a food additive due to concerns over its potential genotoxicity and impact on the immune system."
    },
    {
    "ingredient": "Confectioner's Glaze (Lac Resin)",
    "harmful": "true",
    "rating": "caution",
    "description": "Confectioner's glaze, also known as shellac, is derived from the resinous secretions of the lac bug and may cause allergic reactions in some individuals."
    },
    {
      "ingredient": "Palm Kernel Oil",
      "harmful": "true",
      "rating": "caution",
      "description": "While not banned, palm kernel oil is scrutinized for its environmental impact and potential health effects due to high saturated fat content."
    } 
    
    If the ingredient is compliant, set harmful to "false", rating to "compliant", and description to "". for exmaple:
        {
      "ingredient": "Freeze-Dried Apple",
      "harmful": "false",
      "rating": "compliant",
      "description": ""
    } 
        {
      "ingredient": "Sea Salt",
      "harmful": "false",
      "rating": "compliant",
      "description": ""
    } 
        {
      "ingredient": "Brown Rice Syrup",
      "harmful": "false",
      "rating": "compliant",
      "description": ""
    } 

    `,

    
    },
    {
        role:"user",
        content:ingredient
    }
  ];


    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages,
      temperature: 1,
      top_p: 1,
      stop: null,
      // qwen model is a reasoning model which will include reasoning process in results
      // need to remove the reasoning process from our result's content
      reasoning_format: "hidden",
    });

    const result = await response
    return result.choices[0].message.content


};
