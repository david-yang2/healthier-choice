import { useNavigate } from "react-router-dom";


const Splash = () => {
const navigate = useNavigate()

  return (
    <div style={styles.container} className="flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur">
        <div className="text-4xl font-bold text-gray-900">Healthier Choice</div>
        <p className="mt-4 text-sm text-gray-700" style={{ textAlign: "justify" }}>
          Simply take a picture of the ingredients and we’ll help you identify
          harmful ingredients. <br/>
          <span className="text-xs">* we're currently using Whole Foods' list of banned ingredients</span>
        </p>
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


