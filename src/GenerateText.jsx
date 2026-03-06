import Tesseract from "tesseract.js";
import { useEffect, useState, useContext } from "react";
import { ImageContext } from "./context/ImageContext";
import testImage from "/IMG_4334.JPG";

const GenerateText = () => {
  const { imageFile } = useContext(ImageContext);
  const [imageURL, setImageURL] = useState(null);
  const [generatedText, setGeneratedText] = useState([]);
  const [processing, setProcessing] = useState(false);

  // process the generated text
  const processText = (text) => {
    const removeLinebreak = text.replace(/\n/g, " ");
    // split on anything that's not a letter, number, white space, hyphen(-)
    const removeSpecialCharacters = removeLinebreak.split(/[^\p{L}\p{N}\s-]+/u);
    const trimWhiteSpace = removeSpecialCharacters.map((string) =>
      string.trim(),
    );
    return trimWhiteSpace.filter((string) => string !== "");
  };
  console.log(processing);
  // image to text
  const handleOCR = async () => {
    try {
      setProcessing(true);
      const {
        data: { text },
      } = await Tesseract.recognize(testImage, "eng", {
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
    return (
      <div id="ingredients-container" className="flex flex-col flex-1 min-h-0">
        <div className="text-center bg-white">
          Below are the ingredients. Please confirm that they're correct. Edit
          if needed.
        </div>
        <div className="flex flex-row flex-wrap gap-2 justify-between bg-white flex-1 overflow-y-auto my-2 border-2 border-black p-1">
          {generatedText.map((ingredient, index) => {
            return (
              <input
                key={index}
                type="text"
                value={ingredient}
                className="border-2 border-black rounded-md p-1 text-xs max-w-[45%]"
                onChange={(e) => handleChange(e, index)} // index into generatedText array
              />
            );
          })}
        </div>
      </div>
    );
  };


  // processing UI

  const processingUI = () => {
    return (
      (
          <div className="bg-gray-400 mt-10 flex flex-col  rounded-md space-y-4 px-5 py-4 items-center animate-soft-pulse">
            <div className="text-xl text-center">
              Please wait while we process the image
            </div>
            <div className="bg-gray-300 h-6 w-[90%] rounded-md"> </div>
            <div className="bg-gray-300 h-6 w-[90%] rounded-md"> </div>
            <div className="bg-gray-300 h-6 w-[90%] rounded-md"> </div>
            <div className="bg-gray-300 h-6 w-[90%] rounded-md"> </div>
            <div className="bg-gray-300 h-6 w-[90%] rounded-md"> </div>
            <div className="bg-gray-300 h-6 w-[90%] rounded-md"> </div>
          </div>
        )
    )

  }

  const handleChange = (e, index) => {
    const updatedIngredients = [...generatedText]; // copy array
    updatedIngredients[index] = e.target.value; // update only that index
    setGeneratedText(updatedIngredients); // set new state
  };

  useEffect(() => {
    // if (imageFile) {
    //   setImageURL(URL.createObjectURL(imageFile));
    handleOCR();
    // }
  }, []);

  return (
    <div style={styles.backgroundCover}>
      <div style={styles.overlay} className="flex flex-col justify-start">
        <img src={testImage} alt="" style={{ height: "300px" }} />

        {/* list of ingredients */}
        {processing ? null : displayListofIngredients()}

        {/* buttons */}
        {processing ? processingUI() : (
          <div className="flex justify-around">
            <button
              style={{ background: "red" }}
              onClick={() => {
                handleOCR();
              }}
            >
              No. Process Again
            </button>
            <button
              style={{backgroundColor: "green" }}
              onClick={() => console.log(generatedText)}
            >
              Yes. Proceed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateText;

const styles = {
  backgroundCover: {
    height: "100%",
    backgroundImage: "url(/splash.png)",
    backgroundSize: "cover",
  },
  overlay: {
    height: "100%",
    padding: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },

};
