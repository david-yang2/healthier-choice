import { useNavigate } from "react-router-dom";
import {useEffect} from "react"
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;


const Splash = () => {
const navigate = useNavigate()

  return (
    <div style={styles.container} className="flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur">
        <div className="text-4xl font-bold text-gray-900">Healthier Choice</div>
        <p className="mt-4 text-md text-gray-700" style={{ textAlign: "justify" }}>
          Simply take a picture of the ingredients and the AI model will help you identify any harmful ingredients. <br/>
          <span className="text-xs">* For educational purposes only. AI model will try to identify ingredients that are not in compliance to the EU Commision's Food Saftey Policy</span>
        </p>

        {/* navigate to camera page on click */}
        <button
          className="mt-8 w-full rounded-lg bg-emerald-600 px-4 py-3 text-lg font-bold text-white shadow hover:bg-emerald-700"
          onClick={() => navigate("/camera")}
        >
          Let’s get started
        </button>
      </div>
    </div>
  );
};

export default Splash;

const styles = {
  container: {
    backgroundImage: "url(/splash.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100dvh",
    width: "100%",
  },
};


