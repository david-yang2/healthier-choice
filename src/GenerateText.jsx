import Tesseract from "tesseract.js";
import { useEffect, useState, useContext } from "react";
import { ImageContext } from "./context/ImageContext";
import testImage from "/public/IMG_4334.JPG"

const GenerateText = () => {
  const { imageFile } = useContext(ImageContext);
  const [imageURL, setImageURL] = useState(null);
  const [generatedText, setGeneratedText] = useState("")
  const [processing, setProcessing] = useState(false) 


  const processText = (text) => {
    const removeLinebreak = text.replace(/\n/g, " ")
    // split on anything that's not a letter, number, white space, hyphen(-)
    const removeSpecialCharacters = removeLinebreak.split(/[^\p{L}\p{N}\s-]+/u)
    const trimWhiteSpace = removeSpecialCharacters.map(string => string.trim())
    return trimWhiteSpace.filter(string => string !== "")
  }

  const handleOCR = async () => {
    try {
      setProcessing(prev => !prev)
      const { data: { text } } = await Tesseract.recognize(testImage, "eng", {
        // logger: (m) => console.log(m),
      });
      console.log(processText(text))
      setGeneratedText(processText(text))
      // console.log("OCR result:", text);
      setProcessing(prev => !prev)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // if (imageFile) {
    //   setImageURL(URL.createObjectURL(imageFile));
      handleOCR();
    // }
  }, []);

  return (
    <div>
      <img src={testImage} alt="" style={{maxWidth:"80%"}} />
      <div>

      {processing ? "Please wait while we process the image" : generatedText}
      </div>
      <div>
        Please double check ingredients are correct, if not, you may process the image again
      </div>
      <button onClick={handleOCR}> Process again </button>
    </div>
  );
};

export default GenerateText;