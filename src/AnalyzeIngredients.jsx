



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
