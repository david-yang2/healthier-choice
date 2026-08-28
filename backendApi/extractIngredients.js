import "dotenv/config";
import OpenAI from "openai";

// extract ingredients from image
export const extractIngredients = async (base64EncodedImg) => {
  // create new instance of openai client
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  const messages = [
    {
      role: "system",
      content: `You are given a base64 encoded image. Analyze the content of the image and return a raw JSON array of all ingredients, not a markdown-formatted JSON. 
      Here are some examples of how the results should be formatted:
      
      1. ["flour", "sugar", "butter", "eggs", "milk", "vanilla extract", "salt", "baking powder"]
      2. [ "olive oil", "garlic", "onion", "chicken breast", "tomatoes", "basil", "oregano", "black pepper"]
      3. ["Potatoes", "vegetable oil (conola, corn, soybean, and/or sunflower oil)", "salt"]
      `,
    },
    {
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
    },
  ];

  try {
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
    console.log("extractIngredients result:", result.choices[0].message.content)


    if (!result) {
      throw new Error("Model returned empty ingredient content.");
    }

    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error in extractIngredients:", error);
    throw error;
  }
};
