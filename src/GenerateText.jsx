import Tesseract from "tesseract.js";
import { useEffect, useState, useContext } from "react";
import { ImageContext } from "./context/ImageContext";
import testImage from "/IMG_4334.JPG";
import { AnalyzeIngredients } from "./AnalyzeIngredients";
import { wholeFoodsBannedList } from "./context/wholeFoodsBannedList";
import { useNavigate } from "react-router-dom";

const GenerateText = () => {
  const { imageFile } = useContext(ImageContext);
  const [imageURL, setImageURL] = useState(null);
  const [generatedText, setGeneratedText] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [toggleAnalyzer, setToggleAnalyzer] = useState(false);
  const navigate = useNavigate();

  // process the generated text
  const processText = (text) => {
    const removeLinebreak = text.replace(/\n/g, " ");
    // split on anything that's not a letter, number, white space, hyphen(-)
    const removeSpecialCharacters = removeLinebreak.split(/[^\p{L}\p{N}\s-]+/u);
    const trimWhiteSpace = removeSpecialCharacters.map((string) =>
      string.trim(),
    );
    const finalStrArr = trimWhiteSpace.filter((string) => string !== "");
    const processedTextObj = finalStrArr.map((string, idx) => {
      return { id: idx, ingredient: string, isBanned: false };
    });
    return processedTextObj;
  };

  // image to text
  const handleOCR = async () => {
    try {
      setProcessing(true);
      const {
        data: { text },
      } = await Tesseract.recognize(imageFile, "eng", {
        // logger: (m) => console.log(m),
      });
      setGeneratedText(processText(text));
      // console.log("OCR result:", text);
      setProcessing(false);
    } catch (err) {
      console.error(err);
    }
  };

  // display processed text as inputs

  const displayListofIngredients = () => {
    const numberOfIngredients = generatedText.filter(
      (obj) => obj.isBanned === true,
    ).length;

    return (
      <div
        id="ingredients-container"
        className="flex flex-col flex-1 min-h-0 rounded-xl bg-white/80 p-3 shadow-sm"
      >
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur py-2 px-3 border-b border-gray-200">
          <div className="flex items-center w-[90%] justify-between">
            <div>
              {/* ingredients title/results */}
              {toggleAnalyzer ? (
                <>
                  <div className="text-sm font-semibold">Results:</div>
                  <div className="text-xs text-gray-600">
                    We've finished analyzing the ingredients in your image. Any
                    ingredient highlighted in red is potentially harmful based
                    on Whole Foods' banned ingredients list. Please edit any
                    mistakes if needed.
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-semibold">Ingredients</div>
                  <div className="text-xs text-gray-600">
                    We've analyzed the ingredients in your image. Please edit
                    any mistakes if needed.
                  </div>
                </>
              )}
            </div>

            {/* number container */}
            {toggleAnalyzer ? (
              <div className="text-xs text-gray-500 flex flex-col">
                <div>
                  {numberOfIngredients} / {generatedText.length} item
                  {generatedText.length === 1 ? "" : "s"}
                  <div>were flagged as potentially harmful</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                <div>
                  {generatedText.length} item
                  {generatedText.length === 1 ? "" : "s"}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto py-2">
          {generatedText.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-gray-600">
              <div className="text-sm">
                No ingredients found. Try taking a new photo.
              </div>
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => navigate("/camera")}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {generatedText.map((ingredientObj, index) => (
                <div key={ingredientObj.id}>
                  <input
                    type="text"
                    value={ingredientObj.ingredient}
                    className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none ${ingredientObj.isBanned ? "bg-red-300" : "bg-white"}`}
                    onChange={(e) => handleChange(e, index)} // index into generatedText array
                  />
                  {ingredientObj.bannedMatch && (
                    <div className="text-xs">
                      * ingredient matched:{" "}
                      <span className="font-bold">
                        {ingredientObj.bannedMatch}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // processing UI

  const loadingUI = () => {
    return (
      <div className="flex flex-col flex-1 min-h-0 rounded-xl bg-white/80 p-3 shadow-sm">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur py-2 px-3 border-b border-gray-200">
          <div className="text-sm font-semibold">Processing image...</div>
          <div className="text-xs text-gray-600">
            This can take a few seconds depending on image size.
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto py-4">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500/40 border-t-blue-500 animate-spin" />
          <div className="text-sm text-gray-600">
            Hang tight — we’re extracting the text.
          </div>

          <div className="w-full space-y-2">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="h-4 w-full rounded-full bg-gray-200/80 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleChange = (e, index) => {
    const updatedIngredients = [...generatedText]; // copy object
    updatedIngredients[index].ingredient = e.target.value; // update only that index
    setGeneratedText(updatedIngredients); // set new state
  };

  useEffect(() => {
    if (!imageFile) return;
    window.generatedText = generatedText; // for debugging - can see in console
    const url = URL.createObjectURL(imageFile);
    setImageURL(url);

    handleOCR();

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleProceed = () => {
    setGeneratedText(AnalyzeIngredients(generatedText, wholeFoodsBannedList));
    setToggleAnalyzer((prev) => !prev);
  };

  console.log("this is generated text", generatedText);

  return (
    <div style={styles.backgroundCover} className="flex flex-col">
      <div style={styles.overlay} className="flex flex-col h-full">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-shrink-0">
            <img
              src={imageURL}
              alt="Selected"
              className="w-full max-h-[360px] object-contain rounded-lg border border-white/30"
            />
          </div>

          <div className="flex flex-col flex-1 min-h-0 mt-4">
            {processing ? loadingUI() : displayListofIngredients()}

            {!processing && (
              <div className="flex justify-around mt-4">
                {/* <button onClick={()=>navigate('/camera')}
                  className="px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  
                  <div>Take New Photo</div>
                </button> */}
                <button
                  className="px-4 py-2 text-sm rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                  onClick={() => navigate("/camera")}
                >
                  <i className="fa-solid fa-camera"></i>
                  <div>Retake Photo</div>
                </button>
                <button
                  className="px-4 py-2 text-sm rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition"
                  onClick={() => handleProceed()}
                >
                  Yes. Analyze the ingredients.
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateText;

const styles = {
  backgroundCover: {
    height: "100dvh",
    backgroundImage: "url(/splash.png)",
    backgroundSize: "cover",
  },
  overlay: {
    height: "100%",
    padding: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};
