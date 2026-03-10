import { wholeFoodsBannedList } from "./context/wholeFoodsBannedList";
import { useState, useEffect } from "react";

const AnalyzeIngredients = ({ ingredientsToAnalyze, setToggleAnalyzer }) => {
  const [result, setResult] = useState([]);

useEffect(() => {
  if (!ingredientsToAnalyze || ingredientsToAnalyze.length === 0) {
    setResult([]);
    return;
  }

  // Preprocess banned list once: lowercase all items
  const bannedSet = new Set(
    wholeFoodsBannedList.map((ingredient) => ingredient.toLowerCase())
  );

  // Helper function: check if ingredient is banned (exact match or substring)
  const isBanned = (ingredient) =>
    bannedSet.has(ingredient.toLowerCase()) || // exact match
    wholeFoodsBannedList.some((item) =>
      item.toLowerCase().includes(ingredient.toLowerCase())
    ); // substring match

  // Collect all banned ingredients from input
  const foundBanned = ingredientsToAnalyze.filter(isBanned);

  // Remove duplicates and preserve original casing
  setResult([...new Set(foundBanned)]);
}, [ingredientsToAnalyze]);

  const bannedIngredientsInProduct = () => {
    return result.map((item, idx) => <li key={idx}>{item}</li>);
  };

  return (
    <div style={styles.mainContainer} className="space-y-5">
      <div className="font-bold text-justify">
        Based on your submission, we've indentified the following ingredient(s)
        that are commonly cited as bad ingredients:
      </div>
      <ul>{bannedIngredientsInProduct()}</ul>
      <button onClick={() => setToggleAnalyzer(false)}>
        {" "}
        Return to main page
      </button>
    </div>
  );
};

export default AnalyzeIngredients;

const styles = {
  mainContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "gray",
    borderRadius: "20px",
    padding: "20px 10px",
  },
  // overlay:
};
