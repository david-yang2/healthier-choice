// Helper function: check if ingredient is banned (exact match or substring)
// if matched, update isBanned to true, else return original object
const checkBanned = (bannedArr, ingredientObj) => {
  const ingredient = ingredientObj.ingredient.toLowerCase();

  // try exact match first
  let matchedWord = bannedArr.find((item) => item === ingredient);

  // if no exact match, try substring match
  if (!matchedWord) {
    matchedWord = bannedArr.find((item) => ingredient.includes(item));
  }

  // if match found, return new object with isBanned true and the matched banned word
  if (matchedWord) {
    return {
      ...ingredientObj,
      isBanned: true,
      bannedMatch: matchedWord, // 👈 this is the word that triggered it
    };
  }

  // otherwise return original object with isBanned false
  return ingredientObj;
};




export const AnalyzeIngredients = (
  ingredientsToAnalyze,
  listOfBannedIngredients,
) => {
  // if no ingredients to analyze, return null
  if (!ingredientsToAnalyze || ingredientsToAnalyze.length === 0) {
    return;
  }

  // Preprocess banned list once: lowercase all items
  const bannedLowered = listOfBannedIngredients.map((ingredient) =>
    ingredient.toLowerCase(),
  );

  const foundBanned = ingredientsToAnalyze.map((ingredientObj) =>
    checkBanned(bannedLowered, ingredientObj),
  );
  console.log("this is found banned", foundBanned);
  return foundBanned;
};
