import { useEffect, useState, useContext } from "react";
import { ImageContext } from "../context/ImageContext";
import { postIdentifyHarmfulIngredients } from "../../frontendApi/util.js";
import { useNavigate } from "react-router-dom";

const DisplayHarmfulIngredients = () => {
  const { imageFile, setImageFile } = useContext(ImageContext);
  const [harmfulIngredients, setHarmfulIngredients] = useState();
  const [errorProcessingImg, setErrorProcessingImg] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // check to see if we received a valid JSON response
  const isError = (result) => {
    if (result.error) {
      setErrorProcessingImg(result);
    } else {
      setHarmfulIngredients(result);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      // if imagefile is empty (no file to analyze), navigate back
      if (!imageFile) {
        navigate("/camera");
        return;
      }

      try {
        // can return valid JSON or an error message
        const result = await postIdentifyHarmfulIngredients(imageFile);
        const parsedResult = JSON.parse(result);
        // checks if there was an error processing img
        isError(parsedResult);
      } catch (error) {
        setErrorProcessingImg({
          error: error?.message || "Something went wrong. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [imageFile, navigate]);
  
  const harmfulIngredientsContent = () => {
    const totalIngredients = harmfulIngredients[0].ingredients.length;
    const harmful = harmfulIngredients[1].harmful_ingredients;

    return (
      <div className="flex flex-col gap-6">
        {/* Ingredients summary */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm ">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="text-sm font-semibold text-gray-700">
              All Ingredients
              <span className="ml-2 text-xs font-normal text-gray-500">
                ({totalIngredients} detected)
              </span>
            </div>
          </div>
          <div className="px-4 py-3 flex flex-wrap gap-2">
            <div className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs border border-gray-200">
              {harmfulIngredients[0].ingredients.join(", ")} total
            </div>
          </div>
        </div>

        {/* Harmful ingredients */}
        <div className="rounded-xl border border-red-200 bg-white shadow-sm mb-10">
          <div className="px-4 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2">
            <span className="text-red-500 text-base">⚠️</span>
            <div className="text-sm font-semibold text-red-800">
              Harmful Ingredients
              <span className="ml-2 text-xs font-normal text-red-500">
                ({harmful.length} flagged)
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-100 ">
            {harmful.map((item, idx) => (
              <div key={idx} className="px-4 py-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">
                    {item.ingredient}
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      item.rating === "banned"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    }`}
                  >
                    {item.rating}
                  </span>
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const displayContent = () => {
    if (harmfulIngredients) {
      return (
        <div className="w-full max-w-4xl mx-auto h-full pr-1">
          {harmfulIngredientsContent()}
        </div>
      );
    } else if (errorProcessingImg) {
      return (
        <div className="w-full">
          <div className="rounded-xl border border-red-200 bg-white shadow-sm">
            <div className="px-4 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2 rounded-t-xl">
              <span className="text-red-500 text-base">⚠️</span>
              <div className="text-sm font-semibold text-red-800">
                Unable to Analyze Image
              </div>
            </div>
            <div className="px-4 py-4">
              <div className="text-sm text-gray-700 leading-relaxed">
                {errorProcessingImg.error}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div>initial</div>;
    }
  };

  return (
    <div style={styles.backgroundCover} className="h-dvh flex flex-col">
      <div id="overlay" className="bg-gray-300/50 min-h-dvh flex flex-col gap-2 py-2">
        <header className="flex flex-col min-w-dvw p-2 gap-2 bg-slate-100 rounded-md shadow">
          <div className="text-2xl font-bold"> Analysis Reults </div>
          <div className="text-sm">
            {" "}
            {loading
              ? "Please wait while we analyze your results"
              : "The analysis is complete. Here are the results:"}
          </div>
        </header>
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="h-12 w-12 rounded-full border-4 border-blue-500/40 border-t-blue-500 animate-spin" />
            <div className="text-sm text-gray-600">
              Analyzing your ingredients...
            </div>
          </div>
        ) : (
          <div className={`${containerStyle}`}>{displayContent()}</div>
        )}
        {/* reset image file so camera component can load */}
        <div className="flex justify-center items-center ">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md my-3"
            onClick={() => setImageFile("")}
          >
            Take another photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplayHarmfulIngredients;

const containerStyle =
  "flex flex-1 bg-gray-200 w-full px-3 py-10 overflow-y-auto";

const styles = {
  backgroundCover: {
    backgroundImage: "url(/splash.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
};
