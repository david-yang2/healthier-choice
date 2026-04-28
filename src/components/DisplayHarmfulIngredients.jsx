import { useEffect, useState, useContext } from "react";
import { ImageContext } from "../context/ImageContext";
import { postIdentifyHarmfulIngredients } from "../../api/util";
import { useNavigate } from "react-router-dom";

const DisplayHarmfulIngredients = () => {
  const { imageFile, setImageFile } = useContext(ImageContext);
  const [harmfulIngredients, setHarmfulIngredients] = useState([]);
  const navigate = useNavigate();
  const [validResponse, setValidResponse] = useState()
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    const fetchData = async () => {
      // if imagefile is empty, navigate back 
      if (!imageFile) {
        navigate('/camera')
        return;
      }

      // can return valid JSON or an error message
      const result = await postIdentifyHarmfulIngredients(imageFile);
      console.log("Result from API:", result);
        isValidJSONResponse(result)
      setLoading(false)
    };

    fetchData();
  }, [imageFile]);

  // check to see if we received a valid JSON response
  const isValidJSONResponse = (result) => {
    try {
        // parse if valid JSON reponse
        setHarmfulIngredients(JSON.parse(result).toString())
    // an error indicates no ingredients were analyzed, but still returns a str response
    } catch (e) {
        setHarmfulIngredients(result)
    }
  }

  return (
    <div className="h-dvh flex flex-col">
        <header className="flex flex-col px-3 py-5 gap-2">
            <div className="text-2xl font-bold"> Analysis Reults </div>
            <div className="text-sm"> {loading? "Please wait while we analyze your results" : "The analysis is complete. Here are the results:"}</div>
        </header>
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500/40 border-t-blue-500 animate-spin" />
          <div className="text-sm text-gray-600">Analyzing your ingredients...</div>
        </div>
      ) : (
        <div className={`${containerStyle}`}>{harmfulIngredients}</div>
      )}
      {/* reset image file so camera component can load */}
      <button onClick={() => setImageFile("")}>Go Back</button>
    </div>
  );
};

export default DisplayHarmfulIngredients;

const containerStyle = "flex flex-1 bg-gray-200 w-full px-3 py-10"