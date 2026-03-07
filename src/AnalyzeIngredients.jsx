import { ratings } from "./ratings";
import { useState, useEffect } from "react";

const AnalyzeIngredients = ({ ingredientsToAnalyze, setToggleAnalyzer }) => {
  // array of bad ingredients
  const [badIngredients, setBadIngredients] = useState({});
useEffect(() => {
  ingredientsToAnalyze.forEach((ingredient) => {
    if (ratings[ingredient]) {
      setBadIngredients(prev => ({ ...prev, [ingredient]: ratings[ingredient] }));
    }
  });
}, [ingredientsToAnalyze]);




  return (
    <div style={styles.mainContainer} className="space-y-5">
      <div className="font-bold text-justify">
        Based on your submission, we've indentified the following ingredient(s)
        that are commonly cited as bad ingredients:
      </div>
      <div>{badIngredients.Air.rating}</div>
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
